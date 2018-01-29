#!/usr/bin/env node
let chalk = require('chalk'),
  program = require('commander'),
  inquirer = require('inquirer'),
  fs = require('fs'),
  homedir = require("os").homedir(),
  dir = `${homedir}/.ssh`,
  helpers = require('./helpers'),
  runCommand = helpers.runCommand,
  controller = require('./controller'),
  store = require('./store');

store.open();

program
  .version('0.1.0');

program
  .command('add [filename]')
  .description('Add an ssh key, default filename id_rsa')
  .option('-f, --force', 'Replace existing key if present')
  .option('-p, --passphrase [passphrase]', 'Passphrase protect ssh key')
  .action((filename, options) => {
    if (!filename) filename = 'id_rsa';
    if (options.force) {
      if (fs.existsSync(`${dir}/${filename}`)) fs.unlinkSync(`${dir}/${filename}`);
      if (fs.existsSync(`${dir}/${filename}.pub`)) fs.unlinkSync(`${dir}/${filename}.pub`);
    };
    controller.create(filename, options.passphrase).then(() => {
      console.log(chalk.green(`Successfully created a new ssh key: ${chalk.cyan(filename)}`))
    }).catch((err) => {
      console.log(chalk.red('Error:'), err);
    });
  });

// program
//   .command('remove')
//   .description('Remove ssh key')
//   .action(() => {
//
//   });

program
  .command('config')
  .description('Configure git credentials')
  .option('-u, --username <username>', 'Github username')
  .option('-p, --password <password>', 'Github password')
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
    console.log(chalk.red('Unrecognized command'));
  });

program.parse(process.argv);

let defaultFunction = () => {
  controller.create('id_rsa').then(() => {
    console.log(chalk.green(`Successfully created a new ssh key: ${chalk.cyan('id_rsa')}`))
  }).catch((err) => {
    console.log(chalk.red('Error:'), err);
  });
};

if (process.argv.length == 2) {
  defaultFunction();
};
