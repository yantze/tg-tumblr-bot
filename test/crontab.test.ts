/* global describe, it*/
import { createConnection, Connection } from 'typeorm'
import { Cron } from '../src/entity/Cron'
import crontab from '../src/services/crontab'

let conn: Connection

beforeAll(async () => {
    conn = await createConnection()
})

afterAll(() => {
    conn && conn.close()
    console.log('Connection is closed.')
})

describe('Simple crontab get data test', (...args) => {
    console.log('[Describe] args:', args)

    it('should get a cron table', async (...argsIt) => {
        console.log('[It] args:', argsIt)

        await conn.manager.find(Cron, {})
    })

    it('should run cron service without error', async () => {
        await crontab.start(conn, null)
        crontab.stop()
    })
})
