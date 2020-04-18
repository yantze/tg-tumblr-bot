import { Connection } from 'typeorm'
import { Cron } from '../entity/Cron'
import { Unit } from '../commands'

import { getLogger } from '../common/util'

const log = getLogger('Crontab')

// 每次轮训的时间
const defaultTimeout = 20 * 1000

// 创建一个 pool ，记录了每个用户自己要求的设计间隔，或者默认的提示间隔
// 如果长时间执行，就会导致数字超过
// 如果每次刷新，可能会导致上次

let cronArr = null

export class Crontab {
    timer: NodeJS.Timer
    conn: Connection
    unit: Unit

    constructor() {
        this.timer = null
    }

    async start(conn: Connection, unit: Unit) {
        this.conn = conn
        this.unit = unit
        log.info('crontab is starting...')

        await this.refresh()
        this.schedule()
    }

    stop() {
        clearTimeout(this.timer)
    }

    schedule() {
        this.timer = setTimeout(() => {
            this.doExecute()
        }, defaultTimeout)
        log.info('crontab schedule...')
    }

    doExecute() {
        for (const cron of cronArr) {
            if (cron.executable) {
                cron.executable = false
                this.unit.handleBotCommandId(`crontab.${cron.type}`, {
                    args: [cron],
                })
            }
        }
        this.schedule()
    }

    /**
     * 一般是重新从数据库里面读取数据
     */
    async refresh() {
        cronArr = []
        const crons = await this.conn.manager.find(Cron, {})
        for (const cron of crons) {
            const cronData = Object.assign(
                {
                    executable: true,
                    tgChatId: cron.tgChatId,
                    notify: false,
                    type: cron.type,
                },
                JSON.parse(cron.jsonData),
            )
            cronData.timer = setInterval(() => {
                cronData.executable = true
            }, cronData.interval || 10 * 1000)
            cronArr.push(cronData)
        }
        log.debug('crons:', crons)
    }
}

// omniBot 想到一个新名字
export default new Crontab()
