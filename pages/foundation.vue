<template>
    <StaticPageLayout :title="t('pages.foundation.title')" :subtitle="t('pages.foundation.intro')">
        <h2>{{ t("pages.foundation.members.title") }}</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 not-prose">
            <div>
                <h3 class="text-sm font-semibold tracking-wide text-earth-700 mb-3">{{ t("pages.foundation.members.board") }}</h3>
                <ul class="space-y-1.5 text-sm text-earth-700">
                    <li v-for="m in board" :key="m.name">
                        <strong class="text-earth-900">{{ t(`pages.foundation.roles.${m.role}`) }}</strong>
                        <span class="text-earth-400" style="margin: 0 0.625rem">|</span>{{ m.name }}
                    </li>
                </ul>
            </div>

            <div>
                <h3 class="text-sm font-semibold tracking-wide text-earth-700 mb-3">{{ t("pages.foundation.members.team") }}</h3>
                <ul class="space-y-1.5 text-sm text-earth-700">
                    <li v-for="name in team" :key="name">{{ name }}</li>
                </ul>
            </div>
        </div>

        <h2>{{ t("pages.foundation.transparency.title") }}</h2>
        <p>{{ t("pages.foundation.transparency.commitment") }}</p>
        <p>{{ t("pages.foundation.transparency.controls") }}</p>
        <p>{{ t("pages.foundation.transparency.legalIntro") }}</p>

        <ul>
            <li v-for="law in laws" :key="law.key">
                <a :href="law.url" target="_blank" rel="noopener" class="text-primary-600 hover:text-primary-700 underline">
                    {{ t(`pages.foundation.transparency.laws.${law.key}`) }}
                </a>
            </li>
        </ul>

        <p>
            {{ t("pages.foundation.transparency.amlPre") }}
            <a :href="amlUrl" target="_blank" rel="noopener" class="text-primary-600 hover:text-primary-700 underline">
                {{ t("pages.foundation.transparency.amlLink") }}
            </a>
            {{ t("pages.foundation.transparency.amlPost") }}
        </p>

        <p>
            <a :href="bylawsUrl" target="_blank" rel="noopener" class="text-primary-600 hover:text-primary-700 underline">
                {{ t("pages.foundation.transparency.bylawsLink") }}
            </a>
        </p>

        <h2>{{ t("pages.foundation.partners.title") }}</h2>
        <p class="text-sm leading-7">
            <span v-for="(partner, idx) in partners" :key="partner.name">
                <a v-if="partner.url" :href="partner.url" target="_blank" rel="noopener"
                    class="font-semibold text-primary-600 hover:text-primary-700 underline">{{ partner.name }}</a>
                <strong v-else class="text-earth-800">{{ partner.name }}</strong>
                <span v-if="idx < partners.length - 1" class="text-earth-400" style="margin: 0 0.625rem">|</span>
            </span>
        </p>

        <p class="italic text-earth-600">{{ t("pages.foundation.partners.independence") }}</p>

        <!-- CTA voluntariado: lleva al form de /contribute (opcion HACERME VOLUNTARIO/A ya esta ahi) -->
        <div class="not-prose mt-12 mb-4 rounded-2xl bg-gradient-to-r from-primary-50 via-warm-50 to-primary-50 border border-primary-100 px-6 py-8 md:px-10 md:py-10 text-center">
            <h3 class="text-2xl md:text-3xl font-display font-bold text-earth-900">{{ t("pages.foundation.volunteerCta.title") }}</h3>
            <p class="text-earth-600 mt-2 max-w-xl mx-auto">{{ t("pages.foundation.volunteerCta.text") }}</p>
            <NuxtLink
                to="/contribute"
                class="inline-flex items-center gap-2 mt-5 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-sm"
            >
                {{ t("pages.foundation.volunteerCta.cta") }}
                <ArrowRightIcon class="w-4 h-4" />
            </NuxtLink>
        </div>
    </StaticPageLayout>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from "@heroicons/vue/24/outline"
const { t } = useI18n()

useHead({ title: `${t("pages.foundation.title")} - Fundació Kassumay` })

const board = [
    { role: "president", name: "Pere Jorba i Cuixart" },
    { role: "vicePresident", name: "Lluís Gimenez i Oriol" },
    { role: "secretary", name: "Ramon Giménez i Lluch" },
    { role: "treasurer", name: "Ester Ferrer i Delclós" },
    { role: "member", name: "Rosa Maria Alejandre i Sastre" },
    { role: "member", name: "Jaume Fainé i Andreu" },
    { role: "member", name: "Òscar Ferrer i Cañadas" },
    { role: "member", name: "Marta Giménez i Alejandre" },
    { role: "member", name: "Jaume Giménez i Oriol" },
    { role: "member", name: "Carme Mangues i Sans" },
    { role: "member", name: "Jordi Sala i Hernández" },
    { role: "member", name: "Pau Solé i Sungranyes" },
    { role: "member", name: "Isabel Tapia Martin" },
]

const team = [
    "Rosa Maria Alejandre i Sastre",
    "Carme Mangues i Sans",
    "Jordi Sala i Hernández",
    "Pau Solé i Sungranyes",
    "Isabel Tapia Martin",
    "Ester Ferrer i Delclós",
    "Jaume Giménez i Oriol",
    "Rosa Burgués i Gabarrella",
    "Helena Malet i Vidal",
    "Mònica Martinez i Marin",
    "Ramon Giménez i Lluch",
    "Pere Jorba i Cuixart",
]

const laws = [
    { key: "law1", url: "http://dogc.gencat.cat/ca/pdogc_canals_interns/pdogc_resultats_fitxa/?documentId=490798&language=ca_ES&action=fitxa" },
    { key: "law2", url: "http://portaldogc.gencat.cat/utilsEADOP/PDF/6152/1248505.pdf" },
    { key: "law3", url: "https://portaljuridic.gencat.cat/ca/pjur_ocults/pjur_resultats_fitxa/?action=fitxa&documentId=826623&language=ca_ES&textWords=JUS%2F152%2F2018&mode=single" },
    { key: "law4", url: "http://justicia.gencat.cat/web/.content/documents/publicacions/colleccions/llei_protectorat_96.pdf" },
    { key: "law5", url: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2002-25039" },
]

const amlUrl = "https://www.boe.es/buscar/act.php?id=BOE-A-2010-6737"
const bylawsUrl = "https://fundaciokassumay.org/wp-content/uploads/2020/02/ESTATUTS-DE-LA-FUNDACI%C3%93-PRIVADA-KASSUMAY-PER-A-TOTHOM.pdf"

const partners = [
    { name: "Ajuntament de Sant Boi de Llobregat", url: "http://www.santboi.cat/" },
    { name: "Ajuntament de Begues", url: "http://www.begues.cat/" },
    { name: "Ayuntamiento de Sant Joan Despí", url: "http://sjdespi.net/wca/" },
    { name: "Panet", url: "https://panet.cat/" },
    { name: "Fundació Ordesa", url: "https://www.fundacioordesa.org/" },
    { name: "Fundació Isolana", url: "https://ccfundacions.cat/directori-de-fundacions/fundacio-isolana-proteccio-sostenible-del-medi-ambient/" },
    { name: "Grup T-Automoció", url: "http://www.gruptautomocio.net/" },
    { name: "Govern d'Andorra", url: "https://www.govern.ad/" },
    { name: "Mans Unides Andorra", url: "https://mansunides.ad/" },
    { name: "dFoto'SB", url: "http://www.dphotosb.com/" },
    { name: "Vermuts Miró", url: "http://vermutmiro.com/ca/" },
    { name: "Afoboi", url: "https://afoboi.cat/" },
    { name: "Amics Montsió", url: "" },
    { name: "Apotecaris Solidaris de Palma", url: "https://www.apotecarissolidaris.org/" },
    { name: "MFM Arquitectes", url: "" },
    { name: "SM Gestió BCN", url: "https://gestiobcn.com/" },
    { name: "Eduard Casanovas i Sirvent", url: "http://www.audiconsultores.com/ca/equip/" },
    { name: "Koa Factory", url: "https://koafactory.com/about/" },
    { name: "Caves Nadal", url: "https://nadal.com/" },
]
</script>
