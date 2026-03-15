import type { ValidatorFn } from "~/src/validations"

type ValidationRule = ValidatorFn

type ValidationRules<T extends Record<string, unknown>> = {
    [K in keyof T]?: ValidationRule[]
}

export function useFormValidation<T extends Record<string, unknown>>(form: T, rules: ValidationRules<T>) {
    const errors = reactive<Record<string, string>>({})

    function runField(name: keyof T): boolean {
        const fieldRules = rules[name] || []
        const value = form[name]

        for (const rule of fieldRules) {
            const message = rule(value)
            if (message) {
                errors[String(name)] = message.key
                return false
            }
        }

        errors[String(name)] = ""
        return true
    }

    function validate(): boolean {
        let ok = true
        for (const name of Object.keys(rules) as Array<keyof T>) {
            if (!runField(name)) ok = false
        }
        return ok
    }

    const isValid = computed(() => {
        for (const name of Object.keys(rules) as Array<keyof T>) {
            if (!runField(name)) return false
        }
        return true
    })

    return {
        errors,
        isValid,
        validate,
    }
}
