import fsx from 'fs-extra'
import * as path from 'path'
import { logger } from './utils/log.js'

export async function execute(debug: boolean): Promise<void> {
  const userPath = path.join(process.cwd(), './api-tests')
  const templatePath = path.join(path.dirname(new URL(import.meta.url).pathname), './template')

  const exists = await fsx.pathExists(userPath)

  logger.debug({ title: 'Api Tests Config Exists', object: exists })
  logger.debug({ title: 'User Path', object: userPath })
  logger.debug({ title: 'Template Path', object: templatePath })

  // Prevent overwriting existing configuration files
  await fsx.copy(templatePath, userPath, { overwrite: false })
}
