const keystone = require('keystone')
const { publicKeyToAddress } = requireRoot('lib/utils')
const Types = keystone.Field.Types

const SecuritySignature = new keystone.List('SecuritySignature', {
  nocreate: true,
  noedit: true,
  nodelete: true,
  label: 'Signatures',
  map: { name: 'address' },
  track: {
    createdAt: true
  }
})

SecuritySignature.add({
  type: {
    type: String,
    default: 'ethereum-public-key',
    initial: true,
    required: true
  },
  value: { type: String, initial: true },
  address: { type: String, initial: false, hidden: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', required: true, initial: true }
})

SecuritySignature.schema.pre('save', function (next) {
  switch (this.type) {
    case 'ethereum-public-key':
      this.address = publicKeyToAddress(this.value)
      break;
    default:
      this.address = this.value
  }
  next()
})

SecuritySignature.schema.post('save', function (saved, next) {
  if (keystone.get('app-started')) {
    const { profileProducer } = requireRoot('lib/rabbit')

    profileProducer.send({
      [`${saved.type}`]: saved.address,
      user: saved.user._id
    }, {
      routingKey: `address.created`
    })
  }
  next()
})

SecuritySignature.defaultColumns = 'address, user, type'

SecuritySignature.register()
