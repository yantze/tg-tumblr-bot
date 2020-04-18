import TelegramBot = require('node-telegram-bot-api')
import { Connection } from 'typeorm'

import { getLogger } from '../common/util'
import { Payload, Commands } from '../types/common'

import { TumblrClient } from '../services/tumblr'

import { Channel } from '../entity/Channel'
import { Message } from '../entity/Message'

const log = getLogger('commands')

export default (conn: Connection, bot: TelegramBot): Commands => {
    const channelCommands: Commands = {
        'msg.text': msgText,
        'msg.photo': msgPhoto,
        'tumblr.register': tumblrRegister,
        'tumblr.delete': tumblrDelete,
        'tumblr.close': tumblrClose,
        'tumblr.help': tumblrHelp,
    }
    return channelCommands

    async function msgText(payload: Payload) {
        log.info(...payload.args)
        // const channelName = payload.msg.chat.username
        const tgChannelId = payload.msg.chat.id

        const channel = await conn.manager.findOne(Channel, {
            tgChannelId: tgChannelId + '',
        })
        if (channel) {
            const tumblrToken = channel.tumblrToken
            const tumblrBlogName = channel.tumblrBlogName
            const client = new TumblrClient(tumblrBlogName, tumblrToken)
            const status = await client.createTextPost({
                title: '',
                body: payload.msg.text,
            })
            await createMessage(
                conn,
                channel.tgChannelName,
                tgChannelId + '',
                status.id_string,
            )
            bot.sendMessage(
                tgChannelId,
                `Status: ${status.state}, tumblr post id: ${status.id_string}`,
            )
        }
    }

    async function msgPhoto(payload: Payload) {
        const tgChannelId = payload.msg.chat.id
        const channel = await conn.manager.findOne(Channel, {
            tgChannelId: tgChannelId + '',
        })
        if (channel) {
            const tumblrToken = channel.tumblrToken
            const tumblrBlogName = channel.tumblrBlogName
            const client = new TumblrClient(tumblrBlogName, tumblrToken)
            const status = await client.createPhotoPost({
                data: payload.args[0],
                caption: payload.args[1],
            })
            await createMessage(
                conn,
                channel.tgChannelName,
                tgChannelId + '',
                status.id_string,
            )
            bot.sendMessage(
                tgChannelId,
                `Status: ${status.state}, tumblr photo id: ${status.id_string}`,
            )
        }
    }

    async function tumblrRegister(payload: Payload) {
        const tgChannelId = payload.msg.chat.id
        const tgChannelName = payload.msg.chat.username

        let channel = await conn.manager.findOne(Channel, {
            tgChannelId: tgChannelId + '',
        })

        if (channel) {
            bot.sendMessage(
                tgChannelId,
                `已经注册: ${channel.tumblrBlogName}，先使用 /tumblr.close 删除`,
            )
            return
        }

        // 0:'vastiny.tumblr.com' 1: token
        channel = await registerTgChannel(
            conn,
            tgChannelId + '',
            tgChannelName,
            payload.args[0],
            payload.args[1],
        )

        bot.sendMessage(tgChannelId, `注册成功: ${channel.tumblrBlogName}`)
    }
    async function tumblrDelete(payload: Payload) {
        const tumblrPostId = payload.args[0]
        const tgChannelId = payload.msg.chat.id

        const result = await conn.manager.delete(Message, {
            tumblrPostId: tumblrPostId + '',
        })
        log.info('result:', result)

        const channel = await conn.manager.findOne(Channel, {
            tgChannelId: tgChannelId + '',
        })
        if (channel) {
            const client = new TumblrClient(
                channel.tumblrBlogName,
                channel.tumblrToken,
            )
            const status = await client.deletePost({ id: tumblrPostId })
            bot.sendMessage(tgChannelId, '已删除: ' + status.id_string)
        }
    }

    async function tumblrClose(payload: Payload) {
        const tgChannelId = payload.msg.chat.id
        const result = await conn.manager.delete(Channel, {
            tgChannelId: tgChannelId + '',
        })
        log.info('result:', result)
        bot.sendMessage(tgChannelId, '已关闭，不再发送到 tumblr 中')
    }

    async function tumblrHelp(payload: Payload) {
        const tgChannelId = payload.msg.chat.id
        bot.sendMessage(
            tgChannelId,
            `tumblr 使用帮助：
        /tumblr.help 显示此帮助
        /tumblr.register tumblrBlogName tumblrToken 注册 tumblr blog 客户端
        /tumblr.delete tumblrPostId 删除指定文章的 id
        /tumblr.close 注销当前 tumblr 客户端
        `,
        )
    }
}

async function registerTgChannel(
    conn: Connection,
    tgChannelId: string,
    tgChannelName: string,
    tumblrBlogName: string,
    tumblrToken: string,
) {
    const channel = new Channel()
    channel.tgChannelId = tgChannelId
    channel.tgChannelName = tgChannelName
    channel.tumblrBlogName = tumblrBlogName
    channel.tumblrToken = tumblrToken
    return await conn.manager.save(channel)
}

async function createMessage(
    conn: Connection,
    tgChannelName: string,
    tgChannelId: string,
    tumblrPostId: string,
) {
    const message = new Message()
    message.tgChannelName = tgChannelName
    message.tgChannelId = tgChannelId
    message.tumblrPostId = tumblrPostId
    await conn.manager.save(message)
}
