# Descripción


## Correr en dev

1. Clonar el respositorio
2. Crear una copia del ```.env.template``` y renombrarlo a ```.env``` y cambiar las variables de entorno.
3. Instalar dependencias ```pnpm install ```
4. Levantar la base de dats ```docker compose up -d```
5. Correr las migracions de Prisma ```pnpm prisma migrate dev```
6. Ejecutar seed ```pnpm run seed```
7. Limpiar el localstorage del navegador
8. Correr el proyecto ```pnpm run dev```


## Correr en prod

