const axios = require('axios'),
  { existsSync, readFileSync, unlinkSync } = require('fs'),
  { userInfo } = require('os'),
  { runCommand } = require('../consoleIO'),
  { prompt } = require('inquirer'),
  cosmetic = require('cosmetic');

const create = async (filename, passphrase) => {
  const dir = process.store.keyDirectory;
  await getConfirmation(dir, filename)
  const { username, password } = await getAuth();
  passphrase = await getPassphrase(passphrase);
  // Generate Key
  await runCommand(`ssh-keygen -t rsa -b 4096 -C ${username} -N ${passphrase} -f ${dir}/${filename}`);
  await runCommand(`ssh-add -K ${dir}/${filename}`);
  // Add Key To Github
  const key = readFileSync(`${dir}/${filename}.pub`, 'utf8');
  return axios({
    method: 'post',
    url: `https://api.github.com/user/keys`,
    auth,
    data: {
      title: `${userInfo().username}@${new Date()}`,
      key
    }
  });
};
const getConfirmation = async (dir, filename) => {
  if (existsSync(`${dir}/${filename}`) && existsSync(`${dir}/${filename}.pub`)) {
    const data = await prompt([{
      type: 'confirm',
      name: 'confirm',
      message: ':',
      prefix: `Replace existing ssh key file ${filename}?`
    }]);
    if (data.confirm) {
      if (existsSync(`${dir}/${filename}`)) unlinkSync(`${dir}/${filename}`);
      if (existsSync(`${dir}/${filename}.pub`)) unlinkSync(`${dir}/${filename}.pub`);
      return;
    } else {
      throw new Error('Aborted');
    };
  } else {
    return;
  };
};
const getAuth = async () => {
  const questions = [];
  let username, password;
  if (process.store.gitCredentials.username) {
    username = process.store.gitCredentials.username;
  } else {
    questions.push({
      type: 'input',
      name: 'username',
      message: ':',
      prefix: 'Username'
    });
  };
  if (process.store.gitCredentials.password) {
    password = process.store.gitCredentials.password;
  } else {
    questions.push({
      type: 'password',
      name: 'password',
      message: ':',
      prefix: 'Password'
    });
  };
  if (questions.length !== 0) console.log(cosmetic.cyan('Enter your github credentials'));
  const data = prompt(questions);
  if (data.username) username = data.username.trim();
  if (data.password) password = data.password.trim();
  const response = await axios({
    method: 'get',
    url: `https://api.github.com/user/keys`,
    auth: {
      username,
      password
    }
  });
  return { username, password };
};
const getPassphrase = async (passphrase) => {
  if (!passphrase) {
    return '""';
  } else if (passphrase !== true) {
    return passphrase;
  } else {
    const data = await prompt([{
      type: 'password',
      name: 'passphrase',
      message: ':',
      prefix: 'SSH Passphrase'
    }]);
    passphrase = data.passphrase.trim();
    return`"${passphrase}"`;
  };
};

module.exports = create;
