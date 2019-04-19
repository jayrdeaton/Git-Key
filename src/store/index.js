let fs = require('fs'),
  homedir = require('os').homedir(),
  storeDir = `${homedir}/.config/git-key`,
  { Config } = require('../models');

let open = () => {
  if (fs.existsSync(storeDir)) {
    data = JSON.parse(fs.readFileSync(`${storeDir}/data.json`, 'utf8'));
  } else {
    fs.mkdirSync(`${storeDir}`);
    data = setup();
  };
  process.store = data;
};

let save = (data) => {
  fs.writeFileSync(`${storeDir}/data.json`, JSON.stringify(data, null, 2));
};

let setup = () => {
  let data = new Config();
  save(data);
  return data;
};

open();

module.exports = { open, save, setup };
