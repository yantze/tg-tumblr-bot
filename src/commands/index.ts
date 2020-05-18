import { getLogger } from '../common/util'
import { Payload, Commands } from '../types/common'
import { Connection } from 'typeorm'
import BotCommands from './bot-commands'
import ChannelCommands from './channel-commands'
import TelegramBot = require('node-telegram-bot-api')

const log = getLogger('commands')

// 一个注册环境，并且处理命令的类，
export class Unit {
    conn: Connection
    botCommands: Commands
    channelCommands: Commands

    constructor() {
        this.botCommands = {}
        this.channelCommands = {}
    }

    async register(bot: TelegramBot, conn: Connection) {
        // Create a database connection
        this.conn = conn
        this.botCommands = BotCommands(this.conn, bot)
        this.channelCommands = ChannelCommands(this.conn, bot)
    }

    async handleBotCommandId(id: string, payload: Payload) {
        log.debug('handle:', id, payload.args)
        return this.botCommands[id] && (await this.botCommands[id](payload))
    }

    async handleChannelCommandId(id: string, payload: Payload) {
        log.debug('channel handle:', id, ...payload.args)
        return (
            this.channelCommands[id] &&
            (await this.channelCommands[id](payload))
        )
    }
}
export default new Unit()
