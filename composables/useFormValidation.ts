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
        const fields = Object.keys(rules)
        return fields.every((field) => validateField(field))
    })

    function validate(): boolean {
        const fields = Object.keys(rules)
        let allValid = true
        for (const field of fields) {
            if (!validateField(field)) allValid = false
        }
        return allValid
    }

    return { errors, isValid, validate }
}
