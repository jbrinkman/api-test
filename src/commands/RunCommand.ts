import { CommandModule } from 'yargs'
import { testOptions } from '../models/test-options.js'
import { execute } from '../execute-tests.js'
import { join } from 'path'
import fsx from 'fs-extra'
import { logger } from '../utils/log.js'
import { loadPlugins } from '../hooks/loader.js'
import { deprecationHandler } from 'moment'

const defaultTestConfig = 'testconfig.json'
const defaultTestPlan = 'testplan.json'
const defaultDebug = false

const getOptions = async (config: string): Promise<testOptions> => {
  const filePath = join(process.cwd(), 'api-tests', config)
  const options = (await fsx.readJSON(filePath)) as testOptions
  return options
}

export const RunCommand: CommandModule<{}, unknown> = {
  command: ['run'],

  describe: 'Run the tests',

  builder: {
    testconfig: {
      alias: 'c',
      describe: 'Chose your test configuration file',
      nargs: 1,
      type: 'string',
    },
    testplan: {
      alias: 'p',
      describe: 'The list of tests to perform.',
      nargs: 1,
      type: 'string',
    },
    samples: {
      alias: 's',
      describe: 'The number of times to execute a single test',
      nargs: 1,
      type: 'number',
    },
    runMode: {
      alias: 'r',
      describe: "Can be 'sequence' or 'parallel'",
      nargs: 1,
      type: 'string',
    },
    maxConcurrentRequests: {
      alias: 'm',
      describe: "[default=100] When in runMode='parallel' it is the maximum number of concurrent requests allowed.",
      nargs: 1,
      type: 'number',
    },
    open: {
      alias: 'o',
      describe: 'Open flag shows the latest benchmark results in the default browser when the test is complete.',
      type: 'boolean',
    },
    debug: {
      alias: 'd',
      describe: 'Debug flag enables additional console logging with debug information.',
      type: 'boolean',
    },
    trace: {
      alias: 't',
      describe: 'Trace flag enables additional console logging with trace information.',
      type: 'boolean',
    },
    whatif: {
      alias: 'w',
      describe: 'Whatif flag shows debug information without actually executing the tests.',
      type: 'boolean',
    },
  },

  handler: async (args: any) => {
    const { testplan, samples, runMode, maxConcurrentRequests, open, debug, trace, whatif } = args
    let testconfig = args.testconfig || defaultTestConfig
    let options: testOptions = await getOptions(testconfig)

    // This is an intentional use of a global value that controls logging throughout the application
    // @ts-ignore
    global.AppDebug = options.debug = whatif || debug || (debug === undefined && options.debug) || defaultDebug
    // @ts-ignore
    global.AppTrace = options.trace = trace || (trace === undefined && options.trace) || defaultDebug

    logger.debug({ title: 'Checking TestConfig Input', subtitle: 'Inside Default Commands', object: options })
    logger.trace({ title: 'RunCommand.handler()', object: { args: args } })

    options.testplan = testplan || options.testplan || defaultTestPlan
    options.samples = samples || options.samples || 20
    options.runMode = runMode || options.runMode || 'sequence'
    options.maxConcurrentRequests = maxConcurrentRequests || options.maxConcurrentRequests || 20
    options.open = open || options.open || false
    options.whatif = whatif || false

    logger.debug({ title: 'Test Options', subtitle: 'After console input & config eval inside Default Commands', object: options })

    await loadPlugins(options.plugins, options.global)

    await execute(options)
  },
}
