# Fundació Kassumay — Plataforma web

TFM. Web para una ONG (Fundació Kassumay): noticias, campañas, donaciones
y un panel de admin pequeño y simplificado. Dispone de 4 idiomas (es, ca, en, fr) — `ca` y `fr` a
medias, quedan pendientes de mejorar y aumentar.

Demo desplegada en vercel: https://ong-kassumay-799w.vercel.app/ 

Código en github: https://github.com/sergiolfuoc/ong-kassumay 

## Indice

- [Motivación](#motivación)
- [Que hace](#que-hace)
  - [Roles](#roles)
- [Stack](#stack)
- [Capturas](#capturas)
- [Como levantarlo](#como-levantarlo)
- [Estructura](#estructura)
- [Cosas pendientes](#cosas-pendientes)
- [IA](#ia)
- [Autoría](#autoría)

## Motivación

La fundación tenía una web en Wordpress que les servía de poco poruqe no podían
montar donaciones ni crowdfunding sin meter una pasarela externa de pagos que no se
quedase con los datos del donante, y para cualquier cambio de contenido
me tenían que escribir a mí. La idea era darles algo donde pudieran
publicar noticias y campañas solos, ver el progreso de lo recaudado y,
en algun momento, integrar pagos.

Para mí el TFM era excusa para hacerlo bien. Llevo años con Vue/Node en
startups, así que el reto no era el stack: era aplicarlo a un dominio
nuevo y, sobre todo, no dejar la seguridad solo en el front.

La web que sustituirá el resultado de este proyecto es el siguiente 
wordpress https://fundaciokassumay.org/es/ 

## Que hace

**Pública**: home con tags, listado de noticias y de campañas (filtrables
por tag), página de detalle, y el widget de progreso de la campaña.

**Admin** (`/admin`): crear/editar/publicar/borrar noticias, campañas y
tags. Subir imagenes a Storage. Solo entran ADMINs.

Login y registro los hace Supabase Auth. Cada user tiene su perfil con
avatar y nombre, lo edita en `/profile`.

> Nota: lo que más tiempo me llevó no fue
> montar el CRUD, fue que al subir imágenes desde admin reventaba con un
> error de RLS poco descriptivo. Faltaba una policy de SELECT en
> `storage.objects`, porque `upsert: true` hace SELECT por debajo. Estuve una
> tarde entera para una línea de SQL.

### Roles

Tres. Definidos como árboles `visibility` + `actions` en
`src/services/roles/`.

- **GUEST** — sin sesión. Ve la web pública.
- **USER** — logueado. Ve lo mismo que GUEST + su perfil. Cuando haya
  pasarela, será quien done.
- **ADMIN** — el único que entra a `/admin`. Lo importante: las RLS de
  Postgres comprueban el rol en cada INSERT/UPDATE/DELETE. Si un USER
  intenta llamar al cliente Supabase a pelo saltándose el front, la base
  de datos le responde que no. El guard de UI es solo cosmético.

El rol vive en `profiles` y se sincroniza al cargar el perfil. El
middleware `roleGuard` redirige a `/` si la ruta pide más rol del que
tienes.

## Stack

Nuxt 3 + Vue 3 + TypeScript. Supabase (Postgres + Auth + Storage + RLS).
Tailwind. TipTap para el editor enriquecido. Vitest para tests, sobre
todo de integración contra Supabase local — los mocks no sirven para
probar policies.

Versiones en `package.json`. Node 20+.

## Capturas

Pendiente. TODO: subir capturas de home, detalle de campaña con el
widget, y panel admin a `docs/screenshots/`.

## Como levantarlo

Necesitas Node 20+, npm y Docker corriendo (lo segundo es para Supabase
local).

```bash
npm install --legacy-peer-deps
cp .env.example .env        # SUPABASE_URL y SUPABASE_KEY
npm run dev
```

Y para la base de datos en local:

```bash
npx supabase start          # arranca Postgres + Auth + Storage en Docker
npx supabase db reset       # aplica migraciones desde 0
```

Migraciones en `supabase/migrations/`, se aplican por orden de fecha:
profiles, roles, buckets, news, campaigns, tags.

Comandos npm:

- `npm run dev` — servidor de desarrollo
- `npm run build` / `npm run preview` — build y servirlo
- `npm run test` — Vitest. **Necesita Supabase local arrancado**, si no
  los tests de RLS petan
- `npm run typecheck` — `nuxt typecheck`

Despliegue: Vercel (`vercel.json` ya configurado). Backend en Supabase
Cloud. CI/CD aún no, va en pendientes.

## Estructura

```
ong-platform/
├─ components/        forms, cards, tables, layouts, editor, icons...
├─ composables/       useDataTable, useFormValidation, useNavigation, useServices
├─ i18n/locales/      es, ca, en, fr
├─ middleware/        roleGuard
├─ pages/             rutas públicas + /admin
├─ plugins/           registro de la capa de servicios
├─ src/
│  ├─ config/
│  ├─ navigation/     tabla central de rutas
│  ├─ services/       _base + news, campaigns, tags, profiles, roles
│  ├─ types/
│  └─ validations/
├─ supabase/migrations/   SQL incremental
└─ utils/             formatDate, slug, etc.
```

## Cosas pendientes

Lo gordo:

- Pagos reales con GiveButter. Es el siguiente paso, sin esto las campañas
  no son campañas de verdad.

Lo demás:

- Rol superior "OWNER" además de ADMIN
- Gestión de usuarios donde OWNER podrá modificar el resto de roles de usuarios registrados
- CI/CD
- Tests a nivel de componente (ahora solo hay de servicios)
- Repasar `ca` y `fr` con alguien nativo. Ahora mismo `es` es el que
  mejor está porque lo hablo, `fr` es el peor

## Uso de IA

Lo declaro porque la titulación lo exige. Copilot para autocompletar.
ChatGPT y Gemini puntual para dudas de TipTap y, sobre todo, para depurar las
primeras policies de RLS. Las traducciones i18n las saqué en borrador
con IA y luego las pasé a mano por `es` y `en`; `ca` y `fr` se quedaron
a medio revisar.

## Autoría

- Sergio Luz Fernández
- TFM: Desarrollo de una aplicación web para una ONG
- Máster Universitario en Ingeniería Informática, UOC — Desarrollo de aplicaciones Web
- 2025-2026

Código MIT (ver `LICENSE`). Nombre y recursos gráficos de la Fundació
Kassumay son de la fundación, no míos.