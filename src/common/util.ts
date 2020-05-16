export function getLogger(module: string) {
    return {
        debug: function (infomessage?: any, ...optionalParams: any[]) {
            if (process.env.DEBUG_MODE) {
                console.log(
                    `\x1b[36m[${module}]\x1b[0m ${infomessage}`,
                    ...optionalParams,
                )
            }
        },
        log: function (...args: any[]) {
            console.warn('暂时不建议使用 log.log')
            console.log(...args)
        },
        info: function (...args: any[]) {
            console.log(...args)
        },
        error: function (...args: any[]) {
            console.error(...args)
        },
    }
}
