const keystone = require('keystone')
const crypto = require('crypto')
const bs58 = require('bs58')
const { promisify } = require('util')
const Types = keystone.Field.Types

const SecurityClient = new keystone.List('SecurityClient', {
  label: 'API Clients',
  track: {
    createdAt: true,
    updatedAt: true
  }
})

SecurityClient.add({
  secret: { type: String, initial: false, noedit: true },
  agent: { type: Types.Relationship, ref: 'SecurityAgent', initial: true, noedit: true, required: true },
  isReadAllowed: { type: Boolean, label: 'Allow to read data', initial: true },
  isMarketAllowed: { type: Boolean, label: 'Allow Limit Orders', initial: true },
  isLimitAllowed: { type: Boolean, label: 'Allow Market Orders', initial: true },
  isWithdrawAllowed: { type: Boolean, label: 'Allow withdraw requests', initial: true }
})

SecurityClient.schema.pre('save', function (next) {
  if (!this.secret) {
    promisify(crypto.randomBytes)(128).then(
      random => {
        this.secret = bs58.encode(crypto.createHash('md5').update(random).digest())
        next()
      }
    )
  } else {
    next()
  }
})

SecurityClient.defaultColumns = 'id, agent'

SecurityClient.register()
