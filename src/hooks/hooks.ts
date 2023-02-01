import { plugandplay } from 'plug-and-play'
import { testOptions } from '../models/test-options.js'
import { processResults } from '../services/processResults.js'
import { logger } from '../utils/log.js'

const plugins = plugandplay()

export const apiHooks = {
  plugins: plugins,
  getAuthorization: async () => {
    logger.trace({ title: 'apiHooks.getAuthorization()', object: {} })
    let token = ''
    token = await plugins.call({
      name: 'apitest:getAuthorization',
      handler: () => {
        return 'No Auth Plugin Installed'
      },
    })
    return token
  },
  processTestResults: async (results: any, options: testOptions) => {
    await plugins.call({
      name: 'apitest:processTestResults',
      args: { results: results, options: options },
      // @ts-ignore
      handler: (data) => {
        logger.debug({ title: 'Start processing test results' })
        return processResults(data.results, data.options)
      },
    })
  },
}

// These are all the tokens that can be used as part of headers
// defined in the testplan or testconfig files.
export const headerHooks = { 'apitest:getAuthorization': apiHooks.getAuthorization }
