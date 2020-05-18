import http from 'http'

import { env } from './config'
import { startBot } from './telegram-bot'
import { getLogger } from './common/util'
import gateway from './gateway'

const log = getLogger('index')

startBot().then((unit) => {
    log.info('Telegram Bot started.')

    const handle = gateway(unit)
    const server = http.createServer(handle)

    server.listen(Number(env.SERVER_PORT), env.SERVER_HOST, () => {
        log.info('Start listening', env.SERVER_HOST, 'on', env.SERVER_PORT)
    })
})
