import Router from './router'

export default (router: Router) => {
    router.on('', (ctx) => {
        ctx.res.json({
            _code: 404,
            msg: 'No Route',
        })
    })
    router.on('/', (ctx) => {
        ctx.res.json({
            _code: 200,
            msg: 'Hello World!',
        })
    })
    router.on('/raw', (ctx) => {
        console.log('Headers:\n', ctx.req.headers)
        console.log('query:\n', ctx.req.query)
        console.log('rawData:\n', ctx.req.rawData)

        ctx.res.json({
            _code: 200,
            msg: 'test complete1',
            data: JSON.stringify(ctx.req.rawData),
            headers: ctx.req.headers,
            query: ctx.req.query,
        })
    })
    router.on('/tg', (ctx) => {
        const payload = ctx.req.json()
        const username = payload.sender.login
        const action = payload.action
        const body = payload.comment && payload.comment.body
        const title = payload.issue && payload.issue.title
        const reply = `${username} ${action} comment in issue: "${title}" --- ${body}`
        ctx.unit.handleBotCommandId('msg.text', {
            args: [reply],
            info: {
                chatId: '237319319',
            },
        })
        ctx.res.json({
            _code: 200,
            msg: 'send success',
        })
    })
}
