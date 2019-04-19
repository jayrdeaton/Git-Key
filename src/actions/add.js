const { existsSync, unlinkSync } = require('fs'),
  cosmetic = require('cosmetic'),
  controller = require('../controller');

module.exports = async ({ filename, force, passphrase }) => {
  if (!filename) filename = 'id_rsa';
  if (force) {
    if (existsSync(`${dir}/${filename}`)) unlinkSync(`${dir}/${filename}`);
    if (existsSync(`${dir}/${filename}.pub`)) unlinkSync(`${dir}/${filename}.pub`);
  };
  try {
    await controller.create(filename, passphrase);
    console.log(`${cosmetic.green('success:')} created a new ssh key ${cosmetic.cyan(filename)}`);
  } catch(err) {
    console.log(cosmetic.red(`${err.name}:`), err.message);
  };
};
