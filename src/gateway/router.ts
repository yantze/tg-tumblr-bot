import EventEmitter from 'events'
import { IncomingMessage, ServerResponse } from 'http'

export default class Router extends EventEmitter {
    default: (ctx: any) => void = null

    constructor() {
        super()
    }

    on(path: string, listener: (ctx: any) => void) {
        if (path === '') {
            this.default = listener
        } else {
            super.on(path, listener)
        }
        return this
    }

    emit(path: string, ctx: any) {
        if (this.eventNames().includes(path)) {
            return super.emit(path, ctx)
        } else {
            typeof this.default === 'function' && this.default(ctx)
            return true
        }
    }
}
