const { createConnection } = require('typeorm')

async function main() {
    const conn = await createConnection()

    const crons = conn.manager.find('cron', {
        id: 1,
    })
    console.log('crons:', crons)
}
main()
