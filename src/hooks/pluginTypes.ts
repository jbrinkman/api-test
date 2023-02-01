export interface PluginNamedInfo {
  import: string
  from: string
}

export type PluginInfo = PluginNamedInfo | string

export interface Plugin {
  init: (plugins: any) => void
}

export const isPlugin = (plugin: any): plugin is Plugin => {
  if ((plugin as Plugin)?.init) {
    return true
  }
  return false
}

export const isText = (data: any): data is string => {
  return typeof data === 'string'
}
