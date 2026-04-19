# ong-platform

Plataforma web para una ONG (Fundació Kassumay): Incluye gestión de noticias,
campañas de donación, perfiles de usuario y cierto contenido estático (pagina de legal, transparencia, etc).Toda la web tiene multiidioma.

Stack: Nuxt 3 + Vue 3 + TypeScript + Supabase (Postgres + Auth + Storage + RLS) + TailwindCSS + Vitest.

---

## Contexto del autor Sergio Luz Fernandez

Proyecto TFM desarrollado sobre una base de 8 años de experiencia profesional
como fullstack developer en startups, trabajando principalmente con Vue,
Node y Mongo en entornos de producción.

Algunas decisiones del proyecto reflejan patrones que he aplicado antes en el
trabajo y que adapté aquí al dominio de la ONG:

- **Sistema de Roles con tipado recursivo de rutas de permisos** (`PermissionPath`): el
  tipado `NestedPath` lo arrastré de un sistema anterior
- **Capa de servicios como plugins inicializables** (`PluginBase<ServicesPlugin>`
  + `safeCatch`): favorece testing aislado y desacople de la UI.
- **Tests de integración contra Supabase local**: las
  políticas RLS solo se prueban bien contra una base real.


El proyecto no pretende ser un primer contacto con el stack, sino una
aplicación de criterios profesionales a un dominio nuevo.

---

## Uso de IA

Durante el desarrollo se ha utilizado ocasionalmente asistencia de IA de forma acelerativa, no
sustitutiva:

- **GitHub Copilot** para autocompletado.
- **ChatGPT** puntual para dudas de API de librerías nuevas (Tiptap, políticas
  RLS de Supabase) e instalaciones de paquetes npm.
- **Traducciones i18n (4 locales: es, en, cat, fr)**: generadas con asistencia
  IA y post-editadas parcialmente. Algunas locales (`cat`, `fr`) pueden
  contener inconsistencias residuales o claves faltantes respecto a `es` /
  `en`. No he podido dedicarle el tiempo necesario pero teniendo en cuenta que son textos he considerado que lo importante era el código.

Todas las decisiones arquitectónicas, de dominio (reglas de negocio de
campañas, flujos admin, roles), de seguridad (RLS, policies, bucket auth) y de
diseño son autoría propia.

---

## Setup

Requisitos: Node 20+, npm, Docker (para Supabase local).

```bash
npm install --legacy-peer-deps
cp .env.example .env      # añadir SUPABASE_URL y SUPABASE_KEY
npm run dev               # http://localhost:3000
```

### Supabase local

```bash
instalar docker https://www.docker.com/
iniciar docker
```

```bash
npx supabase start        # Instala y arranca Postgres + Auth + Storage en Docker + aplica migraciones desde supabase/migrations
npx supabase db reset     # aplica migraciones desde supabase/migrations
```

---

## Scripts

| Comando                | Descripción                   |
| ---------------------- | ----------------------------- |
| `npm run postinstall`  | Generar tipos autogenerados de nuxt |
| `npm run dev`          | Dev server Nuxt               |
| `npm run build`        | Build producción              |
| `npm run preview`      | Preview build                 |
| `npm run test`         | Vitest (tests de integración) |
| `npm run typecheck`    | nuxt typecheck                |

---

## Estructura

```
components/      Componentes de front (forms, cards, tables, layouts, editor, icons)
composables/     useDataTable, useFormValidation, useNavigation, useServices
i18n/locales/    es, en, cat, fr 
middleware/      roleGuard
pages/           rutas Nuxt (públicas + admin)
plugins/         services.ts (registra capa de servicios)
src/
  config/        siteConfig
  navigation/    tabla de rutas + tipos
  services/      _base (PluginBase, safeCatch), news, campaigns, profiles, roles
  types/         modelos compartidos
  validations/   validadores reutilizables
supabase/migrations/  SQL incremental (profiles → roles → buckets → news → campaigns)
utils/           helpers (formatDate)
```


