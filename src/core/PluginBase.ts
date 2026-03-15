export abstract class PluginBase<TParent extends PluginBase<any> = any> {
    abstract name: string
    protected abstract _setup(): void | Promise<void>

    initialized = false;
    parent: TParent | null = null

    async setup(): Promise<void> {
        try {
            await this._setup()
            this.initialized = true
        } catch (err) {
            this.error("setup error:", err)
        }
    }

    debug = false
    protected log(...params: unknown[]): void {
        if (this.debug) {
            console.info(`[plugin][${this.name}]`, ...params)
        }
    }
    protected warn(...params: unknown[]): void {
        if (this.debug) {
            console.warn(`[plugin][${this.name}]`, ...params)
        }
    }
    protected error(...params: unknown[]): void {
        console.error(`[plugin][${this.name}]`, ...params);
    }
}
