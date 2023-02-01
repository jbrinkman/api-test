import chalk from 'chalk'
import _ from 'lodash'

const titleStyle = chalk.underline
const subtitleStyle = chalk.bold

export interface logDetails {
  title: string
  object?: any
  subtitle?: string
  message?: string
}

export const logger = {
  debug: (log: logDetails) => {
    // @ts-ignore Suppress implicit any error on global object
    if (AppDebug) {
      console.group(titleStyle(log.title))
      if (log.subtitle) console.debug(subtitleStyle(log.subtitle))
      if (log.message) console.debug(log.message)
      if (log.object) console.dir(log.object)
      console.groupEnd()
      console.debug()
    }
  },
  trace: (log: logDetails) => {
    // @ts-ignore Suppress implicit any error on global object
    if (AppTrace) {
      console.group(titleStyle(log.title))
      if (log.subtitle) console.debug(subtitleStyle(log.subtitle))
      if (log.message) console.debug(log.message)
      if (log.object) console.dir({ params: log.object })
      console.groupEnd()
      console.debug()
    }
  },
}
