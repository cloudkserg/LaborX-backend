const Joi = require('joi')
const AbstractModel = require('../../AbstractModel')

const schemaFactory = () => ({
  id: Joi.string().required(),
  secret: Joi.string().required(),
  address: Joi.string().required(),
  publicKey: Joi.string().required(),
  isReadAllowed: Joi.boolean(),
  isMarketAllowed: Joi.boolean(),
  isLimitAllowed: Joi.boolean(),
  isWithdrawAllowed: Joi.boolean()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class ApiClientModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromMongo (data, context, options) {
    if (data == null) {
      return null
    }
    return new ApiClientModel({
      id: data.id,
      secret: data.secret,
      address: data.address,
      publicKey: data.publicKey,
      isReadAllowed: data.isReadAllowed,
      isMarketAllowed: data.isMarketAllowed,
      isLimitAllowed: data.isLimitAllowed,
      isWithdrawAllowed: data.isWithdrawAllowed
    })
  }
}
