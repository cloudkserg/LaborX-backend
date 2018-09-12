const keystone = require('keystone')
const EventEmitter = require('events')
const templates = requireRoot('mail')
const { Message } = requireRoot('lib/mail')
const { createLogger } = requireRoot('log')
const log = createLogger({
  name: 'EmailNotificationService'
})

const SecurityUserModel = keystone.list('SecurityUser').model
const VerificationRequestModel = keystone.list('VerificationRequest').model

class EmailNotificationService extends EventEmitter {
  async notify (activity) {
    const user = await SecurityUserModel.findOne({
      _id: activity.user
    })

    const userEmail = await this.getUserEmail({
      userId: activity.user
    })

    if (!userEmail) {
      return
    }

    const { project, type } = activity
    const payload = this.preparePayload(activity.payload)

    const template = templates[project][type]

    if (!template) {
      log.warn(`template ${type} for project ${project} doesn't exist`)
      return
    }

    const { subject, content } = template({
      username: user.level1.userName,
      ...activity,
      ...payload
    })

    const message = new Message({
      to: userEmail,
      subject,
      html: content
    })

    log.debug(`send email notification to user: ${user._id}, project: ${project}, type: ${type}`)

    await message.send()
  }

  async getUserEmail ({ userId }) {
    const user = await SecurityUserModel.findOne({
      _id: userId
    })
    let email = user.level2.email

    if (email) {
      return email
    }

    const verificationRequest = await VerificationRequestModel.findOne({
      user: userId,
      level: 'level-2'
    })

    return verificationRequest && verificationRequest.level2.email
  }

  preparePayload (payload) {
    return payload && JSON.parse(payload)
  }
}

module.exports = EmailNotificationService
