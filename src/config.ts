import fs from 'fs'
import path from 'path'

import { getLogger } from './common/util'

const log = getLogger('config')

const DEFAULT_ENV = {
    SERVER_PORT: '8007',
    SERVER_HOST: '127.0.0.1',
}

function getEnv() {
    const envJson = fs.readFileSync(path.join(__dirname, '../.env.json'))
    return JSON.parse(envJson.toString())
}

function initEnv() {
    let envJson: object
    try {
        envJson = getEnv()
    } catch (error) {
        log.error(error)
    }

    envJson = Object.assign({}, DEFAULT_ENV, envJson)
    log.debug('env.json:', envJson)
    Object.assign(process.env, envJson)
    return process.env
}

export const env = initEnv()
