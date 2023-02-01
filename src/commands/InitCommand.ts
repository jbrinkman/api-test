import { CommandModule } from 'yargs'
import { execute } from '../initialize.js'
import { logger } from '../utils/log.js'

export const InitCommand: CommandModule<{}, unknown> = {
  command: 'init',

  describe: "Initialize api-test and create the sample configuration files if the folder doesn't exist",

  builder: {
    debug: {
      alias: 'd',
      describe: 'Debug flag enables additional console logging with debug information.',
      type: 'boolean',
    },
  },

  handler: (args: any) => {
    const { debug } = args
    //@ts-ignore
    global.AppDebug = debug
    logger.debug({ title: 'Intializing Api-Tests' })
    execute(debug as boolean)
  },
}
