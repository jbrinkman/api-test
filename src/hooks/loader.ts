import { loadPlugin, resolvePlugin } from 'load-plugin'
import { logger } from '../utils/log.js'
import { apiHooks } from './hooks.js'
import { isPlugin, isText, Plugin, PluginInfo } from './pluginTypes.js'

export const loadPlugins = async (plugins: Array<PluginInfo> = [], global: boolean = false) => {
  logger.debug({ title: 'Loading Plugins', object: plugins })
  logger.trace({ title: 'loadPlugins()', object: { plugins: plugins } })
  await Promise.all(
    plugins.map(async (p) => {
      const module = isText(p) ? ((await loadPlugin(p, { key: false, global: global })) as Plugin) : ((await loadPlugin(p.from, { key: p.import, global: global })) as Plugin)
      if (!module) {
        const pluginPath = isText(p) ? await resolvePlugin(p, { global: global }) : await resolvePlugin(p.from, { global: global })
        logger.debug({ title: `Failed Loading Module ${JSON.stringify(p)}`, object: pluginPath })
      }
      logger.debug({ title: `Loading Module ${JSON.stringify(p)}`, object: module })
      if (isText(p)) {
        const namedPlugins = Object.keys(module)
        namedPlugins.forEach((pluginName) => {
          const defaultModule = module as any
          if (isPlugin(defaultModule[pluginName])) {
            defaultModule[pluginName].init(apiHooks.plugins)
          } else {
            throw new Error(`Unable to load plugin: ${JSON.stringify(p)}`)
          }
        })
      } else if (isPlugin(module)) {
        module.init(apiHooks.plugins)
      } else {
        throw new Error(`Unable to load plugin: ${JSON.stringify(p)}`)
      }
    }),
  )
}
