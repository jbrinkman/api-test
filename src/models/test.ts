type httpMethodBase = 'get' | 'head' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace'

export type testHttpMethod = Uppercase<httpMethodBase> | httpMethodBase
export interface testEndpointInfo {
  name: string
  method: testHttpMethod
  path: string
  headers: Record<string, any>
  data: Array<Record<string, any>>
}
