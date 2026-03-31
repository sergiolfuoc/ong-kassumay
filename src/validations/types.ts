export interface ValidationError {
    key: string
    params?: Record<string, unknown>
}

export type ValidatorFn = (value: unknown) => ValidationError | null

export type ValidationSchema<T = Record<string, unknown>> = Partial<Record<keyof T, ValidatorFn[]>>
