export type services = Record<string, string>

export interface testOptions {
  service: services
  baseEndpoint: string
  testplan?: string
  samples?: number
  runMode?: string
  maxConcurrentRequests?: number
  open?: boolean
  debug?: boolean
  trace?: boolean
  whatif?: boolean
  headers?: Record<string, any>
  maxMean?: number
  maxSingleMean?: number
  plugins?: Array<string>
  global?: boolean
}
