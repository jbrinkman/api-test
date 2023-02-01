import { measure } from 'api-benchmark'
import fsx from 'fs-extra'
import ora from 'ora'
import { getEndpoints } from './engine/testengine.js'
import { apiHooks } from './hooks/hooks.js'
import { testOptions } from './models/test-options.js'
import { logger } from './utils/log.js'

export const execute = async (options: testOptions): Promise<void> => {
  logger.trace({ title: 'Execute', object: { options: options } })
  const routes = await getEndpoints(options)
  const benchmarkOptions: any = {
    minSamples: options.samples,
    runMode: options.runMode,
    maxConcurrentRequests: options.maxConcurrentRequests,
    stopOnError: false,
  }
  logger.debug({ title: 'Benchmark Options', subtitle: 'Inside Execute Tests', object: benchmarkOptions })

  //TODO: Remove the debug check
  // @ts-ignore
  if (!options.whatif) {
    const throbber = ora({ text: 'Executing tests...', spinner: 'pong' }).start()
    measure(options.service, routes, benchmarkOptions, async function (err: any, results: any) {
      logger.trace({ title: 'measure.cb()', object: { err: err, results: results } })
      const resultsPath = './api-tests/results'
      await fsx.ensureDir(resultsPath)
      await fsx.writeJson(`${resultsPath}/results.json`, results, { spaces: 2 })
      throbber.stop()
      await apiHooks.processTestResults(results, options)
    })
  }
}
