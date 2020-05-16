import EventEmitter from 'events'
import { IncomingMessage, ServerResponse } from 'http'

export default class Router extends EventEmitter {
    default: (req: IncomingMessage, res: ServerResponse) => void = null

    constructor() {
        super()
    }

    on(
        path: string,
        listener: (
            req: IncomingMessage | any,
            res: ServerResponse | any,
        ) => void,
    ) {
        if (path === '') {
            this.default = listener
        } else {
            super.on(path, listener)
        }
        return this
    }

    emit(path: string, req: IncomingMessage, res: ServerResponse) {
        if (this.eventNames().includes(path)) {
            return super.emit(path, req, res)
        } else {
            typeof this.default === 'function' && this.default(req, res)
        }
        return true
    }
}
