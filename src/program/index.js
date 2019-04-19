const { command, option } = require('termkit'),
  cosmetic = require('cosmetic'),
  { add, config, reset } = require('actions'),
  { printError } = require('../consoleIO'),
  { version } = require('../../package.json');

const program = command('git-key')
  .version(version)
  .description('A cli for the gameroom ecosystem')
  .options([
    // option('s', 'selections', '<selections>', 'Supply selections object')
  ])
  .action(async (options) => await add(options))
  .commands([
    // add
    command('add')
      .description('add an ssh key')
      .options([
        option('f', 'force', null, 'overwrite existing key'),
        option('n', 'name', '<name>', 'supply file name, default id_rsa'),
        option('p', 'passphrase', '<passphrase>', 'protect key with passphrase'),
      ])
      .action(async (options) => await add(options)),
    // config
    command('config')
      .description('configure git-key')
      .options([
        // option('d', 'directory', '<directory>', 'ssh key directory'),
        option('u', 'username', '<username>', 'github username')
      ])
      .action(async (options) => await config(options)),
    command('reset')
      .description('reset config file')
      .action(() => reset())
  ]);

module.exports = program;
