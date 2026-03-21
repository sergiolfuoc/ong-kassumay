export interface IServiceResult<TData = void> {
    data: TData | undefined
    error: string | null
}
