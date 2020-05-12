import { startBot } from './telegram-bot'
import { getLogger, getEnv } from './common/util'

const log = getLogger('index')

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
