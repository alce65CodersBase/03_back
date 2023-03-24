# API server

Node-Express API server para pruebas
Creado a partir de otros proyectos

## Instalación

Incluye en la configuración, como dependencias de desarrollo

- TypeScript
- Eslint
- Jest

Como dependencias finales:

- "copyfiles": "^2.4.1",
- "dotenv": "^16.0.3",
- "cross-env": "^7.0.3",
- "debug": "^4.3.4",
- "bcryptjs": "^2.4.3",
- "jsonwebtoken": "^9.0.0",
- "express": "^4.18.2",
- "cors": "^2.8.5",
- "morgan": "^1.10.0"
- "mongoose": "^7.0.0",

## CI/CD

Se conecta con el remoto de Github.
Se añade el análisis del repositorio Github en SonarCloud
Se añade el secret SONAR_TOKEN en el repositorio de GitHub
Se incorporan localmente las Github Actions, incluyendo la de Sonar
Se añade el fichero de configuración de Sonar

Se verifican los comandos de sonar:

- linter: npx eslint --ignore-path .gitignore
- test:prod: ng test --code-coverage --no-watch --browsers=ChromeHeadless",

Se añade husky para los hooks de git

Install husky

```shell
npm i -D husky

```

Enable Git hooks configuring package.json

```shell
npx husky install
npm pkg set scripts.prepare="husky install"
```

- nombres de rama / protección de main
- longitud mínima de los commits

Se crea la rama de configuración y utiliza

- Commits
- Publicación de la rama
- Creación de la PR
- Verificación de la PR

## Initial server

- Mongoose connection;
  - DB config file;
  - Test with real connection
  - Update secrets in Github Actions config and GitHub Repo
- HTTP Server
  - Express App
  - Helper for __dirname
  - Test
  - Static Favicon
  - Home controller (Routes info in JSON) injected
- User definition
  - Entities
  - Mongoose Schema and Model
  - Generic CRUD Repo Interface
  - User CRUD Repo for Mongoose
  - Repo test
- Routes
  - User router:
    - GET: /(getAll) - /:id (get)
    - POST: /register - /login
    - PATCH [logged]: /login
    - PATCH [logged - fromToken]: /
    - PATCH [logged - admin]: /:id - /role/:id
    - DELETE [logged - fromToken]: /
    - DELETE [logged - admin]: /:id
  - Base and User controller
  - Controllers tests
- Errors
  - Interface and HTTPError Class
  - Error Middleware
  - Tests
- Auth
  - Helpers: bcrypt and JWT
  - Interfaces: token, ExtraRequest
  - Auth interceptors
    - logged
    - admin
    - fromToken
  - Tests
