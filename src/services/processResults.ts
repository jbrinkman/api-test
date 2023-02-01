import { getHtml } from 'api-benchmark'
import fsx from 'fs-extra'
import moment from 'moment'
import { testOptions } from '../models/test-options.js'
import { logger } from '../utils/log.js'
import open from 'open'

const openBrowser = async (filePath: string) => {
  await open(filePath)
}

export const processResults = async (results: any, options: testOptions) => {
  const { error, html } = await new Promise((resolve) => {
    return getHtml(results, (error: any, html: any) => resolve({ error, html }))
  })

  const latestOutput = './api-tests/results/latest-benchmarks.html'
  logger.trace({ title: 'getHtml.cb()', object: { error: error } })
  const now = moment()
  fsx.outputFileSync(`./api-tests/results/${now.format('YYYY-MM-DD')}/${now.format('HH-mm-ssZZ')}-benchmarks.html`, html)
  fsx.outputFileSync(latestOutput, html)

  if (options.open) {
    await openBrowser(latestOutput)
  }
}
