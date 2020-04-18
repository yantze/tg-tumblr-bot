import { query } from './tushare'

function getDate(date) {
    return date.toISOString().slice(0, 10).replace(/-/g, '')
}

export async function check(limit: number) {
    const date = new Date()
    const preDayDate = new Date(date.getTime() - 3600 * 24 * 1000)
    const startDate = getDate(preDayDate)
    const endDate = getDate(date)

    const params = {
        ts_code: 'USDCNH.FXCM',
        start_date: startDate,
        end_date: endDate,
    }
    const apiName = 'fx_daily'
    const data = await query(apiName, params)

    console.log('data:', data)

    const today = data.items[0]
    const bidClose = today[3]
    console.log('today:', today)
    if (bidClose < limit) {
        return bidClose
    } else {
        return null
    }
}
