import Toast, { POSITION, type PluginOptions } from "vue-toastification"
import "vue-toastification/dist/index.css"

export default defineNuxtPlugin((nuxtApp) => {
    const options: PluginOptions = {
        position: POSITION.TOP_RIGHT,
        timeout: 4000,
        closeOnClick: true,
        pauseOnHover: true,
    }

    nuxtApp.vueApp.use(Toast, options)
})
