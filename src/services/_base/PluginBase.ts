import type { IServiceResult } from "../common"

export abstract class PluginBase<TParent = any> {
    abstract name: string
    protected abstract _setup(): void | Promise<void>

    initialized = false
    parent: TParent | null

    constructor(parent: TParent | null = null) {
        this.parent = parent
    }

    async setup(): Promise<void> {
        try {
            await this._setup()
            this.initialized = true
        } catch (err) {
            this.error("setup error:", err)
        }
    }

    debug = false
    protected log(...params: any[]): void {
        if (this.debug) {
            console.info(`[plugin][${this.name}]`, ...params)
        }
    }
    protected warn(...params: any[]): void {
        if (this.debug) {
            console.warn(`[plugin][${this.name}]`, ...params)
        }
    }
    protected error(...params: any[]): void {
        console.error(`[plugin][${this.name}]`, ...params);
    }

    protected async safeCatch<T = void>(method: string, action: () => Promise<T>): Promise<IServiceResult<T>> {
        try {
            const data = await action()
            return { data, error: null }
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            this.error(`${method}:`, message)
            return { data: undefined, error: message }
        }
    }
}
