const Joi = require('joi')
const AbstractModel = requireRoot('lib/models/AbstractModel')

const schemaFactory = () => ({
  purpose: Joi.string().required(),
  contract: Joi.string().required()
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
