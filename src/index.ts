import http from 'http'

import { env } from './config'
import { startBot } from './telegram-bot'
import { getLogger } from './common/util'
import handle from './gateway/handle'

const log = getLogger('index')

const server = http.createServer(handle)

server.listen(Number(env.SERVER_PORT), env.SERVER_HOST, () => {
    log.info('Start listening', env.SERVER_HOST, 'on', env.SERVER_PORT)
})

startBot().then(() => {
    log.info('Telegram Bot started.')
})
