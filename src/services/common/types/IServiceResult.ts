export interface IServiceResult<TData = any> {
    data: TData | undefined
    error: string | null
}
