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
}
