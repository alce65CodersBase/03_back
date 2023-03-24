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

#
