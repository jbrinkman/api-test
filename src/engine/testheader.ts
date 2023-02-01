import _ from 'lodash'
import { apiHooks, headerHooks } from '../hooks/hooks.js'
import { logger } from '../utils/log.js'

const tokenRegex = /\$\{(apitest:[a-zA-Z]*)}/g

export const getHeaders = async (optionHeader?: Record<string, any>, testHeader?: Record<string, any>): Promise<Record<string, any>> => {
  logger.trace({ title: 'getHeaders()', object: { optionHeader: optionHeader, testHeader: testHeader } })
  const defaultHeaders = { accept: '*/*' }
  let headers = _.assign(defaultHeaders, optionHeader, testHeader)

  logger.debug({ title: 'Combined Headers', object: headers })

  await processHeaders(headers)

  return headers
}

const processHeaders = async (headers: Record<string, any>) => {
  logger.trace({ title: 'processHeaders()', object: { headers: headers } })
  const keys = Object.keys(headers)
  await Promise.all(
    keys.map(async (k) => {
      if (typeof headers[k] == 'string') {
        let matches = [...headers[k].matchAll(tokenRegex)]
        if (matches) {
          await Promise.all(
            matches.map(async (match) => {
              const tokenName = match[1]
              // @ts-ignore
              const tokenFunction = headerHooks[tokenName]
              const tokenValue = await tokenFunction.call()
              logger.debug({ title: `Hook ${tokenName}`, message: `Token Value: ${tokenValue}`, object: tokenFunction })

              headers[k] = headers[k].replace(match[0], tokenValue)
            }),
          )
        }
      }
    }),
  )
}
