import { createClient, TumblrClient as TumblrClientAPI } from 'tumblr.js'

export const CHANNEL_COMMAND_REGEX = /^\/(\S+)/

export class TumblrClient {
    api: TumblrClientAPI
    blogName: string

    constructor(blogName: string, token: string) {
        const tokens = token.split(':')
        if (tokens.length !== 4) {
            throw new Error('token have four parts.')
        }
        this.api = createClient({
            consumer_key: tokens[0],
            consumer_secret: tokens[1],
            token: tokens[2],
            token_secret: tokens[3],
        })
        this.blogName = blogName
    }

    deletePost(options): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.deletePost(this.blogName, options, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }

    createTextPost(options): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.createTextPost(this.blogName, options, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }

    createPhotoPost(options): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.createPhotoPost(this.blogName, options, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }

    async channelCommand(text) {
        if (typeof text !== 'string') {
            return null
        }

        const match = text.match(CHANNEL_COMMAND_REGEX)
        if (match.length !== 3) {
            console.log('must these format: /add abc')
            return null
        }
        const command = match[1]
        const body = match[2]

        switch (command) {
            case 'delete':
                await this.deletePost({ id: body })
                break

            default:
                console.log('Unknown command:', command, body)
                break
        }
        return { command, commandBody: body }
    }
}
