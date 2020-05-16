import Router from './router'

export default (router: Router) => {
    router.on('', (req, res) => {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end()
    })
    router.on('/', (req, res) => {
        res.json({
            _code: 200,
            msg: 'Hello World!',
        })
    })
    router.on('/raw', (req, res) => {
        console.log('Headers:\n', req.headers)
        console.log('query:\n', req.query)
        console.log('rawData:\n', req.rawData)

        res.json({
            _code: 200,
            msg: 'test complete1',
            data: JSON.stringify(req.rawData),
            headers: req.headers,
            query: req.query,
        })
    })
}
