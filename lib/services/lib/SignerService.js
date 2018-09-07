const Accounts = require('web3-eth-accounts')
const { createLogger } = requireRoot('log')
const { WebError } = requireRoot('lib/errors')

const log = createLogger({
  name: 'SecurityService'
})

class SignerService {
  async signData (privateKey, data) {
    return withSigner(privateKey, signer => {
      return signer.sign(data)
    })
  }

  async signTransaction (privateKey, txData) {
    return withSigner(privateKey, signer => {
      return signer.signTransaction(txData)
    })
  }
}

async function withSigner (privateKey, action) {
  try {
    const accounts = new Accounts()
    const wallet = accounts.wallet.create(0)
    const account = await accounts.privateKeyToAccount(privateKey)
    await wallet.add(account)
    return action(wallet[0])
  } catch (e) {
    console.log('privateKey', privateKey)
    log.error(e.message)
    throw new WebError('Illegal state', 401)
  }
}

module.exports = SignerService
