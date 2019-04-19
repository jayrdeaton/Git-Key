const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs'),
  homedir = require('os').homedir(),
  storeDir = `${homedir}/.config/git-key`,
  { Config } = require('../models');

const open = () => {
  if (existsSync(storeDir)) {
    data = JSON.parse(readFileSync(`${storeDir}/data.json`, 'utf8'));
  } else {
    mkdirSync(`${storeDir}`);
    data = setup();
  };
  process.store = data;
};

const save = (data) => {
  writeFileSync(`${storeDir}/data.json`, JSON.stringify(data, null, 2));
};

const setup = () => {
  const data = new Config();
  save(data);
  return data;
};

open();

module.exports = { open, save, setup };
