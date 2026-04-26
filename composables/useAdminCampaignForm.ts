import type { ICampaignModel } from "~/src/types"
import type { ICampaignCreateParams } from "~/src/services/campaigns"
import { required, minLength, minNumber, dateRange } from "~/src/validations"
import { resolveImageUrl } from "~/pages/admin/_utils"
import { useToast } from "vue-toastification"

// he tenido que sacarlo a composable para aligerar el codigo del componente
export function useAdminCampaignForm(args: {
    onSaved: () => void | Promise<void>
}) {
    const { t } = useI18n()
    const { campaigns: campaignsService, tags: tagsService } = useServices()
    const toast = useToast()
    const user = useSupabaseUser()

    const showForm = ref(false)
    const editingId = ref<number | null>(null)
    const serverError = ref("")
    const imageError = ref("")
    const coverMode = ref<"UPLOAD" | "URL">("UPLOAD")
    const selectedFile = ref<File | null>(null)
    const previewUrl = ref("")
    const isSubmitting = ref(false) // TODO: pasar isSubmitting al form para deshabilitar el boton de save
    const selectedTagIds = ref<number[]>([])

    const form = reactive({
        title: "",
        slug: "",
        description: "",
        excerpt: "",
        image_url: "",
        goal_amount: null as number | null,
        raised_amount: 0,
        start_date: "",
        end_date: "",
        active: false,
    })
    const { errors: formErrors, validate: validateFields, validateField, isValid, reset: resetErrors } = useFormValidation(form, {
        title: [required],
        slug: [required],
        description: [required, minLength(10)],
        goal_amount: [required, minNumber(1)],
        raised_amount: [minNumber(0)],
        start_date: [required],
        end_date: [dateRange(() => form.start_date)],
    })

    function checkImage(): boolean {
        const hasImage = coverMode.value === "UPLOAD" ? !!selectedFile.value : !!form.image_url.trim()
        imageError.value = hasImage ? "" : t("validations.required")
        return hasImage
    }
    function validate(): boolean {
        // valida todos los campos y la imagen para que el usuario vea de golpe todo lo que falta
        const fieldsOk = validateFields()
        const imageOk = checkImage()
        return fieldsOk && imageOk
    }
    const canSubmit = computed(() => {
        if (!isValid.value) return false
        return coverMode.value === "UPLOAD" ? !!selectedFile.value : !!form.image_url.trim()
    })

    const previewCampaign = computed<ICampaignModel>(() => ({
        id: 0,
        title: form.title || t("pages.admin.campaigns.form.previewTitle"),
        slug: form.slug || "ejemplo",
        description: "",
        excerpt: form.excerpt || null,
        image_url: coverMode.value === "UPLOAD" ? previewUrl.value || null : form.image_url || null,
        goal_amount: form.goal_amount ?? null,
        raised_amount: form.raised_amount || 0,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        active: form.active,
        author_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }))

    function autoSlug() {
        if (!editingId.value) form.slug = convertToSlug(form.title)
    }
    const onFileSelected = (file: File | null) => {
        selectedFile.value = file
        if (file) previewUrl.value = URL.createObjectURL(file)
    }
    const clearFile = () => {
        selectedFile.value = null
        previewUrl.value = ""
    }

    function openForm() {
        editingId.value = null
        Object.assign(form, {
            title: "", slug: "", description: "", excerpt: "", image_url: "",
            goal_amount: null, raised_amount: 0, start_date: "", end_date: "", active: false,
        })
        selectedTagIds.value = []
        serverError.value = ""
        imageError.value = ""
        resetErrors()
        coverMode.value = "UPLOAD"
        selectedFile.value = null
        previewUrl.value = ""
        showForm.value = true
    }

    async function editCampaign(campaign: ICampaignModel) {
        editingId.value = campaign.id
        Object.assign(form, {
            title: campaign.title,
            slug: campaign.slug,
            description: campaign.description,
            excerpt: campaign.excerpt || "",
            image_url: campaign.image_url || "",
            goal_amount: campaign.goal_amount,
            raised_amount: campaign.raised_amount,
            start_date: campaign.start_date ? campaign.start_date.slice(0, 10) : "",
            end_date: campaign.end_date ? campaign.end_date.slice(0, 10) : "",
            active: campaign.active,
        })
        selectedTagIds.value = []
        serverError.value = ""
        imageError.value = ""
        resetErrors()
        coverMode.value = campaign.image_url ? "URL" : "UPLOAD"
        selectedFile.value = null
        previewUrl.value = ""
        showForm.value = true

        // tags actuales del registro; si falla la peticion el form sigue funcionando con []
        selectedTagIds.value = await tagsService.getTagIdsForCampaign(campaign.id)
    }

    function closeForm() {
        showForm.value = false
        editingId.value = null
        serverError.value = ""
        imageError.value = ""
    }

    async function saveCampaign() {
        if (isSubmitting.value) return
        isSubmitting.value = true
        try {
            if (!validate()) return

            const { url, error: imgError } = await resolveImageUrl(
                coverMode.value,
                selectedFile.value,
                form.image_url,
                campaignsService.uploadImage.bind(campaignsService),
                form.slug.trim(),
            )
            if (imgError) throw new Error(imgError)

            const params: ICampaignCreateParams = {
                title: form.title.trim(),
                slug: form.slug.trim(),
                description: form.description.trim(),
                excerpt: form.excerpt.trim() || null,
                image_url: url,
                author_id: user.value?.id || null,
                goal_amount: form.goal_amount ?? null,
                raised_amount: form.raised_amount || 0,
                start_date: form.start_date || null,
                end_date: form.end_date || null,
                active: form.active,
            }

            const result = editingId.value
                ? await campaignsService.update(editingId.value, params)
                : await campaignsService.create(params)
            if (result.error) throw new Error(result.error)

            const targetId = editingId.value ?? (result.data as number | undefined) ?? null
            if (targetId != null) {
                const sync = await tagsService.syncForCampaign(targetId, selectedTagIds.value)
                if (sync.error) toast.error(sync.error)
            }

            toast.success(t(editingId.value ? "pages.admin.campaigns.toast.updated" : "pages.admin.campaigns.toast.created"))
            closeForm()
            await args.onSaved()
        } catch (e) {
            serverError.value = e instanceof Error ? e.message : String(e)
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        showForm, editingId, serverError, imageError, coverMode, selectedFile, selectedTagIds,
        form, formErrors, previewCampaign, canSubmit,
        autoSlug, onFileSelected, clearFile,
        openForm, editCampaign, closeForm, saveCampaign, validate, validateField,
    }
}