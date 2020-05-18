import TelegramBot = require('node-telegram-bot-api')
import { Unit } from '../commands'

export interface Payload {
    msg?: TelegramBot.Message
    info?: { chatId: string }
    args: Array<any>
}

export interface Commands {
    [key: string]: (payload: Payload) => Promise<any> | any
}

export interface ServerContext {
    req: any
    res: any
    unit: Unit
}
