import type { ValidatorFn } from './types'

export const required: ValidatorFn = (value) => {
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && !value.length)) {
        return { key: 'validations.required' }
    }
    return null
}

export const email: ValidatorFn = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (typeof value !== 'string' || !value) return null
    return emailRegex.test(value) ? null : { key: 'validations.email' }
}

export const numeric: ValidatorFn = (value) => {
    if (value === null || value === undefined || value === '') return null
    return isNaN(Number(value)) ? { key: 'validations.numeric' } : null
}

export const minLength = (min: number): ValidatorFn => (value) => {
    if (typeof value !== 'string' || !value) return null
    if (value.length < min) return { key: 'validations.minLength', params: { min } }
    return null
}

export const maxLength = (max: number): ValidatorFn => (value) => {
    if (typeof value !== 'string') return null
    return value.length > max ? { key: 'validations.maxLength', params: { max } } : null
}

export const minNumber = (min: number): ValidatorFn => (value) => {
    if (value === null || value === undefined || value === '') return null
    if (Number(value) < min) {
        return { key: 'validations.minNumber', params: { min } }
    }
    return null
}

export const url: ValidatorFn = (value) => {
    if (typeof value !== 'string' || !value) return null
    try { new URL(value); return null }
    catch { return { key: 'validations.url' } }
}
