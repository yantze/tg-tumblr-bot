import { Connection } from 'typeorm'
import TelegramBot = require('node-telegram-bot-api')

import { getLogger } from '../common/util'
import { Payload, Commands } from '../types/common'

import { User } from '../entity/User'
import { Cron } from '../entity/Cron'

import crontab from '../services/crontab'

import * as currency from '../services/currency'

const log = getLogger('commands')

// 汇率
const tsCodes = {
    CNY: 'USDCNH.FXCM',
}

export default (conn: Connection, bot: TelegramBot): Commands => {
    const commands: Commands = {
        'msg.text': msgText,
        'register.user': registerUser,
        'listen.currency': listenCurrency,
        'listen.currency.delete': listenCurrencyDelete,
        'crontab.currency': crontabCurrency,
    }
    return commands

    function msgText(payload: Payload) {
        log.info(...payload.args)
    }

    async function registerUser(payload: Payload) {
        const chatId = payload.msg.chat.id + ''
        const name = payload.msg.chat.username
        const user = await registerTgUser(conn, chatId, name)

        bot.sendMessage(chatId, `注册成功: ${user.name}`)
    }

    async function listenCurrency(payload: Payload) {
        const chatId = payload.msg.chat.id + ''

        if (payload.args[0] !== 'CNY') {
            bot.sendMessage(chatId, '监听失败，暂时只支持 CNY')
            return
        }
        if (!payload.args[1] || typeof Number(payload.args[1]) !== 'number') {
            bot.sendMessage(chatId, '监听失败，第二个参数需要数值')
            return
        }
        const data = {
            tsCode: tsCodes[payload.args[0]],
            threshold: Number(payload.args[1]),
        }
        const type = 'currency'

        const cron = await createCron(conn, chatId, type, data)
        if (cron) {
            bot.sendMessage(chatId, `监听成功: ${cron.jsonData}`)
            return
        }
        await crontab.refresh()
        bot.sendMessage(chatId, '监听失败')
    }

    async function listenCurrencyDelete(payload: Payload) {
        const chatId = payload.msg.chat.id + ''
        const type = 'currency'
        const result = await conn.manager.delete(Cron, {
            type,
            tgChatId: chatId,
        })
        log.info('listenCurrencyDelete', result)
        await crontab.refresh()
        bot.sendMessage(chatId, `已删除当前账户下 listen type: ${type}`)
    }

    async function crontabCurrency(payload: Payload) {
        const cron = payload.args[0]
        log.info('start check currency.')
        if (!cron.tgChatId) {
            log.error('Can not find tgChatId:', cron)
            return
        }
        if (!cron.threshold) {
            log.error('Can not find threshold:', cron)
            return
        }
        const bidClose = await currency.check()
        log.info('返回汇率是：', bidClose)
        if (bidClose < cron.threshold && !cron.notify) {
            bot.sendMessage(cron.tgChatId, `汇率变动: ${bidClose}`)
            cron.notify = true
            return
        } else if (bidClose >= cron.threshold) {
            cron.notify = false
        }
    }
}

async function registerTgUser(conn: Connection, chatId: string, name: string) {
    const user = new User()
    user.name = name // 'u' + Math.random().toString(16).slice(2, 8)
    user.tgChatId = chatId
    return await conn.manager.save(user)
}

async function createCron(
    conn: Connection,
    chatId: string,
    type: string,
    data: object,
) {
    const cron = new Cron()
    cron.type = type
    cron.tgChatId = chatId
    cron.jsonData = JSON.stringify(data)
    return await conn.manager.save(cron)
}
