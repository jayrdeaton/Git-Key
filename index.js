#!/usr/bin/env node
let cosmetic = require('cosmetic'),
  program = require('commander'),
  inquirer = require('inquirer'),
  fs = require('fs'),
  { controller, helpers, store } = require('./src'),
  runCommand = helpers.runCommand;

store.open();

let dir = process.store.keyDirectory;

program
  .version('0.1.0');

program
  .command('add [filename]')
  .description('Add an ssh key, default filename id_rsa')
  .option('-f, --force', 'Replace existing key if present')
  .option('-p, --passphrase [passphrase]', 'Passphrase protect ssh key')
  .action(async (filename, options) => {
    if (!filename) filename = 'id_rsa';
    if (options.force) {
      if (fs.existsSync(`${dir}/${filename}`)) fs.unlinkSync(`${dir}/${filename}`);
      if (fs.existsSync(`${dir}/${filename}.pub`)) fs.unlinkSync(`${dir}/${filename}.pub`);
    };
    try {
      await controller.create(filename, options.passphrase);
      console.log(cosmetic.green(`Successfully created a new ssh key: ${cosmetic.cyan(filename)}`));
    } catch(err) {
      console.log(cosmetic.red(`${err.name}:`), err.message);
    };
  });

// program
//   .command('remove')
//   .description('Remove ssh key')
//   .action(() => {
//
//   });

// program
//   .command('clean')
//   .description('Clean ssh keys')
//   .action(() => {
//
//   });

program
  .command('config')
  .description('Configure git credentials')
  .option('-d, --directory <directory>', 'SSH key directory')
  .option('-u, --username <username>', 'Github username')
  .option('-p, --password <password>', 'Github password * Not secure! *')
  .action((options) => {
    if (options.username) process.store.gitCredentials.username = options.username;
    if (options.password) process.store.gitCredentials.password = options.password;
    if (options.username || options.password) store.save(process.store);
  });

program
  .command('reset')
  .description('Reset config file')
  .action((options) => {
    store.setup();
  });

program
  .command('*')
  .action(() => {
    console.log(cosmetic.red('Unrecognized command'));
  });

program.parse(process.argv);

let defaultFunction = async () => {
  try {
    await controller.create('id_rsa');
    console.log(cosmetic.green(`Successfully created a new ssh key: ${cosmetic.cyan('id_rsa')}`));
  } catch(err) {
    console.log(cosmetic.red(`${err.name}:`), err.message);
  };
};

if (process.argv.length == 2) {
  defaultFunction();
};
