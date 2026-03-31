# Supabase Local - Tests de integracion

Los tests de integracion se ejecutan contra una instancia local de Supabase, que necesita Docker para funcionar.

## 1. Instalar Docker

**Windows:**

1. Descargar Docker Desktop desde [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Ejecutar el instalador y seguir los pasos
3. Reiniciar el ordenador si lo pide
4. Abrir Docker Desktop y esperar a que termine de arrancar

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

Cerrar sesion y volver a entrar para que se aplique el grupo `docker`.

## 2. Instalar Supabase CLI

**Windows (con Scoop):**

Si no tienes Scoop instalado, abre PowerShell y ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

Luego instala Supabase:

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**Linux:**

```bash
curl -sSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.deb -o supabase.deb
sudo dpkg -i supabase.deb
rm supabase.deb
```

## 3. Verificar la instalacion

```bash
docker --version
supabase --version
```

## 4. Levantar Supabase en local

Asegurate de que Docker Desktop esta corriendo y ejecuta desde la raiz del proyecto:

```bash
supabase start
```

Esto puede tardar unos minutos la primera vez porque descarga las imagenes de Docker.

## 5. Ejecutar los tests

Todos los tests:

```bash
npm test
```

Un test concreto:

```bash
npx vitest run src/services/news/_test/NewsServicePlugin.spec.ts
npx vitest run src/services/profiles/_test/ProfileServicePlugin.spec.ts
```

## 6. Parar Supabase

Cuando termines de testear:

```bash
supabase stop
```
