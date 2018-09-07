const keystone = require('keystone')
const { privateKeyToPublicKey, publicKeyToAddress } = require('../utils')

const Types = keystone.Field.Types

const SecurityAccount = new keystone.List('SecurityAccount', {
  nocreate: false,
  noedit: true,
  nodelete: false,
  label: 'Server Accounts',
  map: { name: 'address' },
  track: {
    createdAt: true
  }
})

SecurityAccount.add({
  type: {
    type: Types.Select,
    options: [
      { value: 'ethereum', label: 'Ethereum' }
    ],
    default: 'ethereum',
    initial: true,
    required: true
  },
  address: { type: String, initial: false, noedit: true },
  publicKey: { type: String, initial: false, noedit: true },
  privateKey: { type: String, initial: true },
  user: { type: Types.Relationship, ref: 'SecurityUser', required: true, initial: true }
})

SecurityAccount.schema.pre('save', function (next) {
  switch (this.type) {
    case 'ethereum': {
      this.publicKey = privateKeyToPublicKey(this.privateKey)
      this.address = publicKeyToAddress(this.publicKey)
      break
    }
  }
  next()
})

SecurityAccount.defaultColumns = 'address, user, type'

SecurityAccount.register()
