import fs from 'fs'
import path from 'path'

import { startBot } from './telegram-bot'
import { getLogger } from './common/util'

const log = getLogger('index')

function getEnv() {
    const envJson = fs.readFileSync(path.join(__dirname, '../.env.json'))
    return JSON.parse(envJson.toString())
}

try {
    const envJson = getEnv()
    log.debug('env.json:', envJson)
    Object.assign(process.env, envJson)
} catch (error) {
    log.error(error)
}

startBot().then(() => {
    log.info('Telegram Bot started.')
})
