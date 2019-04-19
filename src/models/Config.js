let homedir = require('os').homedir();

module.exports = class Config {
  constructor(data) {
    this.keyDirectory = `${homedir}/.ssh`;
    this.gitCredentials = {
      username: null,
      password: null
    };
  };
};
