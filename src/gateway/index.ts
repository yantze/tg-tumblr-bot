import url from 'url'
import querystring from 'querystring'
import { IncomingMessage, ServerResponse } from 'http'

import Router from './router'
import hooks from './hooks'
import { Unit } from '../commands'
import { ServerContext } from '../types/common'
// writable steam
// const busboy = require('busboy')

const router = new Router()
hooks(router)

function parseBody(req: IncomingMessage, newReq: any) {
    return new Promise((resolve) => {
        newReq.query = querystring.parse(url.parse(req.url).query)

        if (req.method === 'POST') {
            let body = ''

            req.on('data', (data) => (body += data))
            req.on('end', (_) => {
                newReq.hasJSON = req.headers['content-type'].startsWith(
                    'application/json',
                )
                newReq.jsonData = newReq.hasJSON ? parseBodyJSON(body) : {}
                newReq.hasForm = req.headers['content-type'].startsWith(
                    'application/x-www-form-urlencoded',
                )
                newReq.formData = newReq.hasForm ? parseBodyForm(body) : {}

                newReq.rawData = body
                resolve()
            })
        } else {
            resolve()
        }
    })
}

/**
 * 这里的对象，就算错误也是空对象，因为有 hasJSON 判断就够了
 * @param {string} body String
 */
function parseBodyJSON(body: string) {
    try {
        return body.length > 0 ? JSON.parse(body) : {}
    } catch (e) {
        console.error(e)
        return {}
    }
}

/**
 * 有 hasForm 判断就够了
 * @param {string} body String
 */
function parseBodyForm(body) {
    return querystring.parse(body)
}

export default function gateway(unit: Unit) {
    return (req: IncomingMessage, res: ServerResponse) => {
        console.log(`\n${req.method} ${req.url} HTTP/${req.httpVersion}`)

        const newReq: any = {}
        const newRes: any = {}
        const _req = new Proxy(newReq, {
            get(target, key, receiver) {
                return (target[key] && target[key]) || req[key]
            },
            set(target, key, val) {
                target[key] = val
                return true
            },
        })
        const _res = new Proxy(newRes, {
            get(target, key, receiver) {
                return (target[key] && target[key]) || req[key]
            },
            set(target, key, val) {
                target[key] = val
                return true
            },
        })

        newReq.json = () => {
            let jsonData = null
            try {
                jsonData = JSON.parse(newReq.rawData)
            } catch (e) {
                console.error(e)
            }
            return jsonData
        }
        newRes.json = (obj: object) => {
            // res.setHeader('Content-Type', 'text/html');
            // res.setHeader('X-Foo', 'bar');
            // res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            res.write(JSON.stringify(obj))
            res.end('')
        }
        newReq.path = url.parse(req.url).pathname

        const ctx: ServerContext = {
            req: _req,
            res: _res,
            unit,
        }

        parseBody(req, newReq).then((_) => {
            router.emit(newReq.path, ctx)
        })
    }
}
