let axios = require('axios'),
  fs = require('fs'),
  os = require('os'),
  { runCommand } = require('../consoleIO'),
  inquirer = require('inquirer'),
  cosmetic = require('cosmetic');

let create = async (filename, passphrase) => {
  let dir = process.store.keyDirectory;
  await getConfirmation(dir, filename)
  let auth = await basicAuth();
  passphrase = await getPassphrase(passphrase)
  await generateSSH(dir, filename, auth.username, passphrase)
  await addKeyToGithub(dir, filename, auth);
};
let getConfirmation = async (dir, filename) => {
  if (fs.existsSync(`${dir}/${filename}`) && fs.existsSync(`${dir}/${filename}.pub`)) {
    let question = [
      {
        type: 'confirm',
        name: 'confirm',
        message: ':',
        prefix: `Replace existing ssh key file ${filename}?`
      }
    ];
    let data = await inquirer.prompt(question)
    if (data.confirm) {
      if (fs.existsSync(`${dir}/${filename}`)) fs.unlinkSync(`${dir}/${filename}`);
      if (fs.existsSync(`${dir}/${filename}.pub`)) fs.unlinkSync(`${dir}/${filename}.pub`);
      return;
    } else {
      throw new Error('Aborted');
    };
  } else {
    return;
  };
};
let basicAuth = async () => {
  let questions = [];
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
  let data = inquirer.prompt(questions);
  if (data.username) username = data.username.trim();
  if (data.password) password = data.password.trim();
  let response = await axios({
    method: 'get',
    url: `https://api.github.com/user/keys`,
    auth: {
      username,
      password
    }
  });
  return { username, password };
};
let getPassphrase = async (passphrase) => {
  if (!passphrase) {
    return '""';
  } else if (passphrase !== true) {
    return passphrase;
  } else {
    let question = [
      {
        type: 'password',
        name: 'passphrase',
        message: ':',
        prefix: 'SSH Passphrase'
      }
    ];
    let data = await inquirer.prompt(question);
    passphrase = data.passphrase.trim();
    return`"${passphrase}"`;
  };
};
let generateSSH = async (dir, filename, username, passphrase) => {
  await runCommand(`ssh-keygen -t rsa -b 4096 -C ${username} -N ${passphrase} -f ${dir}/${filename}`);
  await runCommand(`ssh-add -K ${dir}/${filename}`);
};
let addKeyToGithub = (dir, filename, auth) => {
  let key = fs.readFileSync(`${dir}/${filename}.pub`, 'utf8');
  return axios({
    method: 'post',
    url: `https://api.github.com/user/keys`,
    auth,
    data: {
      title: `${os.userInfo().username}@${new Date()}`,
      key
    }
  });
};

module.exports = { create };
