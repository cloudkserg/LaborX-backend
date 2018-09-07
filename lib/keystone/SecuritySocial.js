const keystone = require('keystone')
const Types = keystone.Field.Types

const SecuritySocial = new keystone.List('SecuritySocial', {
  // nocreate: true,
  noedit: true,
  map: {
    name: 'purpose'
  },
  label: 'Socials',
  track: {
    createdAt: true,
    updatedAt: true
  }
})

SecuritySocial.add({
  purpose: { type: String },
  socialNetwork: { type: String },
  socialId: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  user: { type: Types.Relationship, ref: 'SecurityUser', initial: true, required: true }
})

SecuritySocial.defaultColumns = 'purpose, socialNetwork, socialId, user, createdAt, updatedAt'

SecuritySocial.register()
