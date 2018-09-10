const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const { securityService } = requireRoot('lib/services')
const config = require('config')
// const { asyncHandler, authenticate } = require('../middleware')

const router = express.Router()

if (config.has('oauth')) {
  for (const [name, {strategy, ...settings}] of Object.entries(config.oauth)) {
    switch (strategy) {
      case 'google':
        setupGoogleStrategy(name, strategy, settings)
        break
      case 'facebook':
        setupFacebookStrategy(name, strategy, settings)
        break
    }
  }
}

function setupGoogleStrategy (name, strategy, { purpose, options }) {
  passport.use(
    name,
    new GoogleStrategy(
      options,
      async function (accessToken, refreshToken, profile, done) {
        try {
          const social = await securityService.upsertSocial({
            socialNetwork: 'google',
            socialId: profile.id,
            purpose,
            accessToken,
            refreshToken,
            details: {
              name: profile.displayName,
              image: profile.image
            }
          })
          done(null, social.user)
        } catch (e) {
          done(e)
        }
      }
    )
  )
}

function setupFacebookStrategy (name, strategy, { purpose, options }) {
  passport.use(
    name,
    new FacebookStrategy(
      options,
      async function (accessToken, refreshToken, profile, done) {
        try {
          const social = await securityService.upsertSocial({
            socialNetwork: 'facebook',
            socialId: profile.id,
            purpose,
            accessToken,
            refreshToken,
            details: {
              name: profile.displayName,
              image: profile.image
            }
          })
          done(null, social.user)
        } catch (e) {
          done(e)
        }
      }
    )
  )
}

router.get('/:name', (req, res, next) => {
  const { name } = req.params
  const { state } = req.query
  const { scope } = config.oauth[name]
  const authenticate = passport.authenticate(name, { scope, state })
  return authenticate(req, res, next)
})

router.get('/:name/callback', (req, res) => {
  const { name } = req.params
  const { state } = req.query
  const { strategy, purpose, routes } = config.oauth[name]
  const authenticate = passport.authenticate(name, { session: false, failureRedirect: routes.failureRedirect })
  return authenticate(req, res, async () => {
    try {
      const token = await securityService.upsertToken({ user: req.user, purpose, expressRequest: req })
      res
        .cookie('Token', token.token, { expires: 0, secure: true, sameSite: false })
        .cookie('Authenticator', `oauth-${strategy}`, { expires: 0, secure: true, sameSite: false })
        .redirect(
          state
            ? (routes.successRedirect + `?state=${state}`)
            : routes.successRedirect
        )
    } catch (e) {
      res
        .clearCookie('Token')
        .clearCookie('Authenticator')
        .redirect(
          state
            ? (routes.failureRedirect + `?state=${state}`)
            : routes.failureRedirect
        )
    }
  })
})

module.exports = router
