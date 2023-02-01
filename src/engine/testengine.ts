import { endpoint, endpoints, httpMethod } from 'api-benchmark'
import fsx from 'fs-extra'
import { join } from 'path'
import { testEndpointInfo } from '../models/test.js'
import { testOptions } from '../models/test-options.js'
import _, { max } from 'lodash'
import { generateTemplateString } from '../utils/templatestring.js'
import { getHeaders } from './testheader.js'
import { logger } from '../utils/log.js'
import { option } from 'yargs'

const loadTestPlan = async (testPlanName: string, debug: boolean): Promise<testEndpointInfo[]> => {
  const planPath = join(process.cwd(), '/api-tests', testPlanName)
  logger.debug({ title: 'Test Plan - Full Path', object: planPath })

  const testplan = (await fsx.readJson(planPath)) as testEndpointInfo[]

  return testplan
}

const createPath = (test: any, index?: number): string => {
  //if there is data with additional parameters, insert them into the path
  if (test.data && index != undefined) {
    let pathFunc = generateTemplateString(test.path)
    return pathFunc({ data: test.data[index] })
  }
  //if there are no extra parameters return just the path
  return test.path
}

const getMaxMean = (optionMaxMean?: number, testMaxMean?: number): number | undefined => {
  if (testMaxMean) {
    return testMaxMean
  }
  if (optionMaxMean) {
    return optionMaxMean
  }
  return undefined
}

const getMaxSingleMean = (optionSingleMaxMean?: number, testSingleMaxMean?: number): number | undefined => {
  if (testSingleMaxMean) {
    return testSingleMaxMean
  }
  if (optionSingleMaxMean) {
    return optionSingleMaxMean
  }
  return undefined
}

export const getEndpoints = async (options: testOptions): Promise<endpoints> => {
  logger.trace({ title: 'getEndpoints()', object: { options: options } })
  const testDefinitions = await loadTestPlan(options.testplan as string, options.debug as boolean)

  logger.debug({ title: 'Initial Option Headers', subtitle: 'BEFORE getHeaders in Test Engine', object: options.headers })
  logger.debug({ title: 'Test Definitions', subtitle: 'Inside test engine', object: { testDefinitions } })
  let tests: endpoints = {}

  await Promise.all(
    testDefinitions.map(async (test) => {
      //for tests with no extra data parameters
      if (!test.data) {
        let path = createPath(test)
        let testHeaders = await getHeaders(options.headers, test.headers)

        const currentEndpoint: endpoint = (tests[test.name] = {
          method: test.method,
          route: join(options.baseEndpoint, path),
          headers: testHeaders,
        })
        currentEndpoint.maxMean = options.maxMean
        currentEndpoint.maxSingleMean = options.maxSingleMean

        logger.debug({ title: `${test.name} | Endpoint Data`, subtitle: 'AFTER getHeaders & join path inside getEndpoints in Test Engine', object: tests[test.name], message: "Full Test with NO data Parameters'" })
      }

      //for tests with additional data parameters
      else {
        //will loop over each data set and create a seperate route/endpoint

        await Promise.all(
          test.data.map(async (d) => {
            let index = test.data.indexOf(d)
            let path = createPath(test, index)
            let testHeaders = await getHeaders(test.headers, options.headers)

            logger.debug({ title: `${test.name}-${index + 1} | Combined Test Headers`, subtitle: 'AFTER getHeaders & createPath inside getEndpoints in Test Engine', object: { Path: path, Headers: testHeaders } })

            let currentEndpoint: endpoint = {
              method: test.method,
              route: join(options.baseEndpoint, path),
              headers: testHeaders,
            }

            currentEndpoint.data = d.body || currentEndpoint.data
            currentEndpoint.expectedStatusCode = d.statusCode || currentEndpoint.expectedStatusCode
            currentEndpoint.maxMean = getMaxMean(options.maxMean, d.maxMean) || currentEndpoint.maxMean
            currentEndpoint.maxSingleMean = getMaxSingleMean(options.maxSingleMean, d.maxSingleMean) || currentEndpoint.maxSingleMean

            tests[`${test.name}-${index + 1}`] = currentEndpoint

            logger.debug({ title: `${test.name}-${index + 1} | Endpoint Data`, subtitle: 'AFTER getHeaders & join path inside getEndpoints in Test Engine', object: currentEndpoint, message: 'Test HAD Data Parameters' })
          }),
        )
      }
    }),
  )

  logger.debug({ title: 'Full Test Plan', subtitle: 'After Get Endpoints', object: tests })

  return tests
}
