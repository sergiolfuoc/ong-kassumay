import type { ValidatorFn } from "~/src/validations"

export function useFormValidation(form: Record<string, any>, rules: Record<string, ValidatorFn[]>) {
    const errors = reactive<Record<string, string>>({})
    function validateField(name: string): boolean {
        const validators = rules[name] || []
        const value = form[name]
        for (const validator of validators) {
            const failure = validator(value)
            if (failure) {
                errors[name] = failure.key
                return false
            }
        }
        errors[name] = ""
        return true
    }
    
    const isValid = computed(() => {
        return Object.keys(rules).every((field) => {
            const validators = rules[field] || []
            const value = form[field]
            return validators.every((v) => v(value) === null)
        })
    })

    function validate(): boolean {
        const fields = Object.keys(rules)
        let allValid = true
        for (const field of fields) {
            if (!validateField(field)) allValid = false
        }
        return allValid
    }

    function reset() {
        for (const field of Object.keys(rules)) {
            errors[field] = ""
        }
    }

    return { errors, isValid, validate, validateField, reset }
}
