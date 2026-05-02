# Supabase en local — para los tests de integracion

Los tests de integracion del proyecto no usan mocks, levantan una
instancia real de Supabase en tu maquina y la atacan de verdad. La razon
es que las RLS (Row Level Security) de Postgres son una de las cosas
mas dificiles de mockear bien y, sinceramente, no me fio. Si pruebas las
policies contra un mock acabas testeando el mock, no la policy.

Para que esto funcione necesitas dos cosas instaladas en tu maquina:
Docker (porque Supabase local corre dentro de contenedores) y la CLI de
Supabase (que es la que orquesta esos contenedores). Si las dos cosas
estan ya instaladas, salta directo al apartado de **levantar Supabase**.

## Instalar Docker

Si nunca has tocado Docker antes: es un sistema que te permite ejecutar
programas dentro de "contenedores" aislados de tu sistema operativo. Para
lo que nos interesa, basicamente significa que no vas a tener que
instalar Postgres a mano ni configurarlo, lo hace Supabase por debajo.

### En Windows

Lo mas comodo es Docker Desktop:

1. Vete a https://www.docker.com/products/docker-desktop y descarga el
   instalador para Windows.
2. Ejecutalo y dale a siguiente, siguiente. Te pedira reiniciar el
   ordenador, hazlo.
3. La primera vez que abras Docker Desktop tarda un buen rato en
   arrancar (esta inicializando WSL2 por debajo). Espera a que el icono
   de la bandeja se ponga verde / fijo, sin animacion.

> Nota: si nunca has activado WSL2 puede que Windows te pida hacerlo y
> reiniciar otra vez.

### En Linux (Ubuntu / Debian)

Aqui no necesitas Docker Desktop, basta con el `docker` de los
repositorios oficiales:

```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

Por defecto Docker requiere `sudo` para todo. Si no quieres estar
metiendo la contraseña cada vez (yo no quiero), añadete al grupo
`docker`:

```bash
sudo usermod -aG docker $USER
```

Esto **no se aplica hasta que cierras sesion y vuelves a entrar**, no
basta con abrir otra terminal. Si te lo saltas y ejecutas `docker ps` te
saldra un permission denied y puedes pensar que lo has hecho mal.

## Instalar la CLI de Supabase

Supabase tiene una CLI propia (`supabase`) que es la que se encarga de
arrancar / parar / resetear la instancia local. No vale con el cliente
JS que ya usa el proyecto, esto es otra cosa, una herramienta de linea
de comandos.

### En Windows con Scoop

[Scoop](https://scoop.sh) es un gestor de paquetes para Windows estilo
`brew` o `apt`. Si nunca lo has usado, abre **PowerShell** (no la
clasica `cmd`) y ejecuta primero esto para permitir que se ejecuten
scripts firmados:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Te preguntara si estas seguro, dile que si. Luego ya puedes instalar
Scoop:

```powershell
irm get.scoop.sh | iex
```

Y a partir de ahi, anades el repositorio (bucket) de Supabase y haces
el install normal:

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### En Linux

El equipo de Supabase publica un `.deb` listo para instalar. Lo bajas,
lo instalas con `dpkg` y luego puedes borrar el paquete porque ya esta
en el sistema:

```bash
curl -sSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.deb -o supabase.deb
sudo dpkg -i supabase.deb
rm supabase.deb
```

Si no estas en una distro derivada de Debian, hay binarios sueltos en
las releases del repositorio oficial: https://github.com/supabase/cli/releases

## Comprobar que esta todo bien instalado

Antes de seguir, una verificacion rapida desde cualquier terminal:

```bash
docker --version
supabase --version
```

Las dos te tienen que devolver una version. Si alguna no, vuelve atras
al paso correspondiente.

## Levantar Supabase

Lo primero, importante: **Docker tiene que estar corriendo**. En Windows
eso significa con Docker Desktop abierto y el icono en verde. En Linux
con el `systemctl` activo (lo dejaste activado arriba con `enable`, asi
que deberia estar tras un reinicio).

Una vez confirmado, desde la raiz del proyecto:

```bash
supabase start
```

La primera vez que ejecutas esto **tarda lo suyo**: se baja varias
imagenes de Docker (la de Postgres, la de Auth, la de Storage, la del
Studio web…) que pesan unos cuantos cientos de megas en total. Vete a
por un cafe. Las siguientes veces ya las tiene cacheadas y arranca en
unos segundos.

Cuando termina te imprime por consola las URLs y las claves locales (la
URL de la API, la URL del Studio, el `anon key`, el `service_role
key`…). Estas claves son las que usan los tests, no necesitas copiarlas
a mano salvo que quieras abrir el Studio en el navegador para curiosear.

## Ejecutar los tests

Con Supabase ya levantado, los tests se lanzan con npm como cualquier
otro proyecto:

```bash
npm test
```

Eso ejecuta toda la suite. Si solo quieres correr un fichero concreto
(util cuando estas debuggeando uno y no quieres esperar a que pasen
todos), Vitest acepta el path como argumento:

```bash
npx vitest run src/services/news/_test/NewsServicePlugin.spec.ts
npx vitest run src/services/profiles/_test/ProfileServicePlugin.spec.ts
```

Si los tests fallan con un error tipo "connection refused" o "ECONNREFUSED",
casi seguro es que se te ha olvidado arrancar Supabase, o lo has parado
sin querer. Comprueba con `supabase status` que esta todo en verde antes
de volver a lanzar los tests.

## Parar Supabase cuando acabes

Los contenedores siguen corriendo de fondo aunque cierres la terminal,
asi que cuando termines la sesion de trabajo conviene pararlos para no
tener Docker comiendote RAM:

```bash
supabase stop
```

Si quieres ademas tirar la base de datos local (por ejemplo si has
ensuciado los datos haciendo pruebas y quieres empezar de cero la
proxima vez), `supabase stop --no-backup` no guarda el snapshot, o bien
`supabase db reset` te aplica las migraciones desde cero contra la
instancia que tengas levantada.
