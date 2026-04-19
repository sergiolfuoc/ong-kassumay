import { describe, it, expect } from "vitest"
import { convertToSlug } from "~/utils/convertToSlug"

describe("convertToSlug", () => {
    it("lowercases y reemplaza espacios por guiones", () => {
        expect(convertToSlug("Hola Mundo")).toBe("hola-mundo")
    })

    it("elimina acentos y diacriticos", () => {
        expect(convertToSlug("Niños, acción y café")).toBe("ninos-accion-y-cafe")
    })

    it("elimina espacios multiples y guiones repetidos", () => {
        expect(convertToSlug("  hola   mundo  ")).toBe("hola-mundo")
        expect(convertToSlug("hola---mundo")).toBe("hola-mundo")
    })

    it("elimina caracteres especiales", () => {
        expect(convertToSlug("¡Hola, mundo! ¿Qué tal?")).toBe("hola-mundo-que-tal")
    })

    it("recorta guiones iniciales y finales", () => {
        expect(convertToSlug("-hola-")).toBe("hola")
    })

    it("devuelve string vacia si la entrada no tiene caracteres validos", () => {
        expect(convertToSlug("!!!")).toBe("")
        expect(convertToSlug("   ")).toBe("")
    })

    it("conserva numeros", () => {
        expect(convertToSlug("Proyecto 2026 beta")).toBe("proyecto-2026-beta")
    })
})
