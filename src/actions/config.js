const store = require('../store')

module.exports = ({ username }) => {
  if (username) process.store.gitCredentials.username = username
  if (username) store.save(process.store)
}
