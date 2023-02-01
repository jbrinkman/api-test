#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { InitCommand, RunCommand } from './commands/index.js'
export { apiHooks } from './hooks/hooks.js'
export { logger } from './utils/log.js'

yargs(hideBin(process.argv)).command(RunCommand).command(InitCommand).demandCommand(1, '').argv
