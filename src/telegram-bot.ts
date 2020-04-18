process.env.NTBA_FIX_319 = '1'

import TelegramBot = require('node-telegram-bot-api')
import { createConnection } from 'typeorm'

import crontab from './services/crontab'

import { CHANNEL_COMMAND_REGEX } from './services/tumblr'
import unit from './commands'

export async function startBot() {
    // replace the value below with the Telegram token you receive from @BotFather
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) {
        throw new Error('need set .env{-prod}.json TELEGRAM_BOT_TOKEN')
    }

    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(token, { polling: true })

    const conn = await createConnection()
    // Register telegram bot
    await unit.register(bot, conn)

    // Start crontab services
    await crontab.start(conn, unit)

    // Listen for any kind of message. There are different kinds of messages.
    bot.on('message', async (msg) => {
        if (CHANNEL_COMMAND_REGEX.test(msg.text)) {
            const result = msg.text.match(/(\/)?\S+/g)
            if (result) {
                const commandId = result[0].slice(1)
                unit.handleBotCommandId(commandId, {
                    msg,
                    args: result.slice(1),
                })
            }
            return
        }
        unit.handleBotCommandId('msg.text', { msg, args: [msg.text] })
    })

    bot.on('channel_post', async (msg) => {
        if (CHANNEL_COMMAND_REGEX.test(msg.text)) {
            const result = msg.text.match(/(\/)?\S+/g)
            if (result) {
                const commandId = result[0].slice(1)
                unit.handleChannelCommandId(commandId, {
                    msg,
                    args: result.slice(1),
                })
            }
            return
        }

        if (msg.photo) {
            const rawFileMeta = msg.photo[msg.photo.length - 1]
            const fileStream = bot.getFileStream(rawFileMeta.file_id)
            unit.handleChannelCommandId('msg.photo', {
                msg,
                args: [fileStream, msg.caption],
            })
            return
        }

        unit.handleChannelCommandId('msg.text', { msg, args: [msg.text] })
    })
}
