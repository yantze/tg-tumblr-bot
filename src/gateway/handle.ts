import url from 'url'
import querystring from 'querystring'

import Router from './router'
import hooks from './hooks'
import { IncomingMessage, ServerResponse } from 'http'
// writable steam
// const busboy = require('busboy')

const router = new Router()
hooks(router)

function parseBody(req) {
    return new Promise((resolve) => {
        req.query = querystring.parse(url.parse(req.url).query)

        if (req.method === 'POST') {
            let body = ''

            req.on('data', (data) => (body += data))
            req.on('end', (_) => {
                req.hasJSON = req.headers['content-type'].startsWith(
                    'application/json',
                )
                req.jsonData = req.hasJSON ? parseBodyJSON(body) : {}
                req.hasForm = req.headers['content-type'].startsWith(
                    'application/x-www-form-urlencoded',
                )
                req.formData = req.hasForm ? parseBodyForm(body) : {}

                req.rawData = body
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

export default function handle(
    req: IncomingMessage | any,
    res: ServerResponse,
) {
    console.log(`\n${req.method} ${req.url} HTTP/${req.httpVersion}`)

    Object.assign(req, {
        json() {
            let jsonData = null
            try {
                jsonData = JSON.parse(req.rawData)
            } catch (e) {
                console.error(e)
            }
            return jsonData
        },
    })
    Object.assign(res, {
        json(obj: object) {
            // res.setHeader('Content-Type', 'text/html');
            // res.setHeader('X-Foo', 'bar');
            // res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            res.write(JSON.stringify(obj))
            res.end('')
        },
    })

    parseBody(req).then((_) => {
        const pathname = url.parse(req.url).pathname
        router.emit(pathname, req, res)
    })
}
