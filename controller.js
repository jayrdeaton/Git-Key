let axios = require('axios'),
  fs = require('fs'),
  os = require('os'),
  homedir = os.homedir(),
  dir = `${homedir}/.ssh`,
  helpers = require('./helpers'),
  runCommand = helpers.runCommand,
  inquirer = require('inquirer'),
  chalk = require('chalk');

let create = (filename, passphrase) => {
  return new Promise((resolve, reject) => {
    getConfirmation(filename).then(() => {
      basicAuth().then((auth) => {
        getPassphrase(passphrase).then((passphrase) => {
          generateSSH(filename, auth.username, passphrase).then(() => {
            addKeyToGithub(filename, auth).then(() => {
              resolve();
            }).catch((err) => {
              reject(err);
            });
          }).catch((err) => {
            reject(err);
          });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
};
let getConfirmation = (filename) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(`${dir}/${filename}`) && fs.existsSync(`${dir}/${filename}.pub`)) {
      let question = [
        {
          type: 'confirm',
          name: 'confirm',
          message: ':',
          prefix: `Replace existing ssh key file ${filename}?`
        }
      ];
      inquirer.prompt(question).then((data) => {
        if (data.confirm) {
          if (fs.existsSync(`${dir}/${filename}`)) fs.unlinkSync(`${dir}/${filename}`);
          if (fs.existsSync(`${dir}/${filename}.pub`)) fs.unlinkSync(`${dir}/${filename}.pub`);
          resolve();
        } else {
          reject('Aborted');
        };
      }).catch((err) => {
        reject(err);
      });
    } else {
      resolve();
    };
  });
};
let basicAuth = () => {
  return new Promise((resolve, reject) => {
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
    if (questions.length !== 0) console.log(chalk.cyan('Enter your github credentials'));
    inquirer.prompt(questions).then((data) => {
      if (data.username) username = data.username.trim();
      if (data.password) password = data.password.trim();
      axios({
        method: 'get',
        url: `https://api.github.com/user/keys`,
        auth: {
          username,
          password
        }
      }).then((response) => {
        console.log(response);
        resolve({ username, password });
      }).catch((err) => {
        reject('Github authorization failed');
      });
    }).catch((err) => {
      reject(err);
    });
  });
};
let getPassphrase = (passphrase) => {
  return new Promise((resolve, reject) => {
    if (!passphrase) {
      resolve('""');
    } else if (passphrase !== true) {
      resolve(passphrase);
    } else {
      let question = [
        {
          type: 'password',
          name: 'passphrase',
          message: ':',
          prefix: 'SSH Passphrase'
        }
      ];
      inquirer.prompt(question).then((data) => {
        passphrase = data.passphrase.trim();
        resolve(`"${passphrase}"`);
      }).catch((err) => {
        reject(err);
      });
    };
  });
};
let generateSSH = (filename, username, passphrase) => {
  return new Promise((resolve, reject) => {
    runCommand(`ssh-keygen -t rsa -b 4096 -C ${username} -N ${passphrase} -f ~/.ssh/${filename}`).then((data) => {
      runCommand(`ssh-add -K ~/.ssh/${filename}`).then((data) => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    });
  });
};
let addKeyToGithub = (filename, auth) => {
  return new Promise((resolve, reject) => {
    let key = fs.readFileSync(`${dir}/${filename}.pub`, 'utf8');
    axios({
      method: 'post',
      url: `https://api.github.com/user/keys`,
      auth,
      data: {
        title: `${os.userInfo().username}@${new Date()}`,
        key
      }
    }).then((data) => {
      resolve(data)
    }).catch((err) => {
      reject(err);
    });
  });
};
module.exports = { create };
