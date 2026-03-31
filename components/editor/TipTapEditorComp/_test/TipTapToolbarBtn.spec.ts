import { describe, it, expect } from "vitest"
import { createApp, h, defineComponent, ref, nextTick } from "vue"
import TipTapToolbarBtn from "../components/TipTapToolbarBtn.vue"

// monto a mano con createApp porque @vue/test-utils me da problemas
function mountBtn(props: Record<string, unknown> = {}, onClick?: () => void) {
    const root = document.createElement("div")
    document.body.appendChild(root)

    const Wrapper = defineComponent({
        setup() {
            const clicked = ref(0)
            return () => h(TipTapToolbarBtn, {
                ...props,
                onClick: () => {
                    clicked.value++
                    onClick?.()
                },
            })
        },
    })

    const app = createApp(Wrapper)
    app.mount(root)

    return {
        root,
        button: root.querySelector("button")!,
        cleanup: () => {
            app.unmount()
            root.remove()
        },
    }
}

describe("TipTapToolbarBtn", () => {
    it("Success: renderiza un boton con label cuando se pasa label", () => {
        const { button, cleanup } = mountBtn({ label: "B" })
        expect(button).toBeTruthy()
        expect(button.textContent?.trim()).toBe("B")
        cleanup()
    })

    it("Success: aplica clase active cuando active=true", () => {
        const { button, cleanup } = mountBtn({ label: "B", active: true })
        // primary-100 viene del computed btnClass cuando active
        expect(button.className).toContain("bg-primary-100")
        cleanup()
    })

    it("Success: no emite click si esta disabled", async () => {
        let clicks = 0
        const { button, cleanup } = mountBtn({ label: "B", disabled: true }, () => { clicks++ })

        button.click()
        await nextTick()
        // disabled deberia bloquear el emit, no solo a nivel de atributo HTML
        expect(clicks).toBe(0)
        cleanup()
    })

    it("Success: emite click cuando esta habilitado", async () => {
        let clicks = 0
        const { button, cleanup } = mountBtn({ label: "B" }, () => { clicks++ })

        button.click()
        await nextTick()
        expect(clicks).toBe(1)
        cleanup()
    })

    // TODO: testear que pinta el icon cuando se pasa component en lugar de label.
    // habria que pasar un componente real y comprobar que renderiza el svg, lo dejo
    // para futuro
})