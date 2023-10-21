const RevokedToken = require('../models/revokedTokenSchema')

// When a user logs out, insert the token into the revokedTokens collection.
const revokeToken = async (token, reason) => {
  const revokedToken = new RevokedToken({
    token,
    reason,
  })
  await revokedToken.save()
}

// When validating tokens, check if the token is in the revokedTokens collection.
const isTokenRevoked = async (token) => {
  const revoked = await RevokedToken.findOne({ token }).exec()
  return !!revoked
}

module.exports = { revokeToken, isTokenRevoked }
