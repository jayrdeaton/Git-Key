const { command, option } = require('termkit'),
  cosmetic = require('cosmetic'),
  { printError } = require('../consoleIO'),
  { version } = require('../../package.json');

const program = command('git-key')
  .version(version)
  .description('A cli for the gameroom ecosystem')
  .options([
    // option('s', 'selections', '<selections>', 'Supply selections object')
  ])
  .action(async (options) => await gameroom(options))
  .commands([
    // batch
    // command('batch', '<resource> <attributes>')
    // .description('Update a batch of objects of a supplied resource with given attributes')
    // .options([
    //   option('f', 'filter', '<object>', 'Set filter object'),
    //   option('s', 'sort', '<object>', 'Set sort object'),
    //   option('l', 'limit', '<number>', 'Set limit for fetch, default 100'),
    //   option(null, 'skip', '<number>', 'Set skip for fetch'),
    //   option('o', 'offset', '<number>', 'Set offset for fetch'),
    // ])
    // .action(async (options) => await batch(options)),
  ]);

module.exports = program;
