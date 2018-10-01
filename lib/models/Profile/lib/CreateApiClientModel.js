const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  contract: Joi.string().required(),
  principal: Joi.string().required(),
  purpose: Joi.string().required(),
  isReadAllowed: Joi.boolean(),
  isMarketAllowed: Joi.boolean(),
  isLimitAllowed: Joi.boolean(),
  isWithdrawAllowed: Joi.boolean()
})

module.exports.schemaFactory = schemaFactory

module.exports.model = class CreateApiClientModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory, options)
    Object.freeze(this)
  }

  static fromJson (data, context, options) {
    if (data == null) {
      return null
    }
    return new CreateApiClientModel({
      ...data
    })
  }
}
