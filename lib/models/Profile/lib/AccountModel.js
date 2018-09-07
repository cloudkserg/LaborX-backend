const Joi = require('joi')
const AbstractModel = require('../../AbstractModel')

const schemaFactory = () => ({
  type: Joi.string().required(),
  address: Joi.string().required(),
  publicKey: Joi.string().required()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class AccountModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }
    return new AccountModel({
      type: data.type,
      address: data.address,
      publicKey: data.publicKey
    })
  }
}
