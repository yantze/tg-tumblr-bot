import TelegramBot = require('node-telegram-bot-api')

export interface Payload {
    msg?: TelegramBot.Message
    args: Array<any>
}

export interface Commands {
    [key: string]: (payload: Payload) => Promise<any> | any
}
