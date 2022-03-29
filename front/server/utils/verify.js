/**
 * @desc jwt verify
 * @author justJokee
 */
const jwt = require('jsonwebtoken')
const { userSecret } = require('../db/secret')

module.exports = async function verify(token, cb) {
  const secret = `${userSecret.salt}`
  jwt.verify(token, secret, (err) => {
    cb(err)
  })
}
