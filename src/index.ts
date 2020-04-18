import fs from 'fs'
import path from 'path'

import { startBot } from './telegram-bot'
import { getLogger } from './common/util'

// https://github.com/typeorm/typescript-express-example/blob/master/src/index.ts
// https://typeorm.io/#/entities/column-types

const log = getLogger('index')

let env = null
try {
    const envJson = fs.readFileSync(path.join(__dirname, '../.env.json'))
    env = JSON.parse(envJson.toString())
    Object.assign(process.env, env)
} catch (error) {
    log.error(error)
}

startBot()
