#!/usr/bin/env node

const { consoleIO, program } = require('./'),
  { printError } = consoleIO

const run = async(args) => {
  try {
    await program.parse(args)
  } catch(err) {
    printError(err)
  }
}

run(process.argv)
