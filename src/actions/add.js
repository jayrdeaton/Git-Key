const { existsSync, unlinkSync } = require('fs'),
  cosmetic = require('cosmetic'),
  { createKey } = require('../helpers')

module.exports = async ({ filename, force, passphrase }) => {
  if (!filename) filename = 'id_rsa'
  if (force) {
    if (existsSync(`${dir}/${filename}`)) unlinkSync(`${dir}/${filename}`)
    if (existsSync(`${dir}/${filename}.pub`)) unlinkSync(`${dir}/${filename}.pub`)
  }
  try {
    await createKey(filename, passphrase)
    console.log(`${cosmetic.green('success:')} created a new ssh key ${cosmetic.cyan(filename)}`)
  } catch(err) {
    console.log(cosmetic.red(`${err.name}:`), err.message)
  }
}
