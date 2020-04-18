import fetch from 'node-fetch'

export async function query(
    apiName: string,
    params: object,
    fields: string = '',
) {
    const token = process.env.TUSHARE_TOKEN
    if (!token) {
        throw new Error('No TUSHARE_TOKEN in process.env.')
    }
    const body = {
        api_name: apiName,
        token,
        params,
        fields,
    }
    const res = await fetch('https://api.tushare.pro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(body),
    })

    const info = await res.json()
    if (info.code === 0) {
        return info.data
    } else {
        console.log('info:', info)
        throw new Error(`Fail: ${info.msg}`)
    }
}

// async function main(){
//     const params = {
//         ts_code: 'USDCNH.FXCM',
//         start_date: '20200405',
//         end_date: '20200415',
//     }
//     const apiName = 'fx_daily'
//     const data = await query(apiName, params)
//     console.log('data:', data)
// }
// main()
