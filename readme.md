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

## Initial server for Users

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

### Images Upload

En el registro se incorpora la capacidad de recibir/almacenar imágenes

Se instala Multer

```shell
npm i multer
npm i -D @types/multer
```

Se añade como middleware

```js
import multer from 'multer';
const upload = multer({ dest: 'uploads/' })
// in the route
upload.single('image')
```

upload.single() devuelve un middleware que se coloca antes del controller que debe recibir las imágenes

Se encapsula multer y su configuración en la clase FilesMiddleware

Su método singleFileStore

- crea un objeto con la configuración de Multer
  - storage: folder/filName
  - limits: fileSize
- devuelve el middleware creado por Multer
    // Save as req.file is the `fileName` file
    // req.body will hold the text fields, if there were any

Los datos guardados en req.file corresponden al siguiente formato

```ts
{
  fieldname: 'image',
  originalname: 'pepe.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'uploads',
  filename: 'pepe-c179a6c2-d135-4c6c-a213-d456237bbe61.png',
  path: 'uploads\\pepe-c179a6c2-d135-4c6c-a213-d456237bbe61.png',
  size: 94675
}
```

Un segundo método

- recoge el valor de req.file.filename
- lo convierte en una url válida
- lo pasa a req.body.${req.file.fieldname}
    (campo previsto en el Schema para la url de la imagen)

Este mismo método podría crear una copia de la imagen en algún sistema de almacenamiento (e.g. Firebase)

### BackUp

Se modifica la entidad y el schema de mongoose para que las propiedad image
sea un objeto que pueda almacenar toda la información de la imagen.

Se incorpora la configuración de Firebase a la aplicación

```shell
npm install firebase
```

Se añade la configuración de FireBase en .env y en el fichero de configuraciones
Se actualiza los secrets en GitHub y en las GitHub Actions

Se crea una clase FireBase que configura el Store

```ts
// Import the functions you need from the SDKs you need
import { initializeApp ... } from "firebase/app";
import { getStorage ... } from 'firebase/storage';
import { firebaseConfig } from '../config.js';

constructor() {
      // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    this.storage = getStorage(this.app);
}
```

Se crea el método uploadFile capaz de:

- leer el fichero con la imagen desde el FS
- definir una ref de FireStore
- cargar los datos del fichero en la ref
- devolver la url para recuperar el fichero desde firebase

Se incorpora en el middleware saveImage
la llamada a la clase FireBase para salvar una copia de la imagen en
FireBase junto con la que se guarda en el servidor

### Images Optimization

Se instala Sharp

```shell
npm i sharp
npm i -D @types/sharp
```

Se añade un nuevo método a la clase FilesMiddleware
Se transforma y re-dimensiona el fichero en base a una configuración pre-establecida para las imágenes de una ruta concreta (e.g. registro), que se obtiene directamente de la request

Se actualizan todos los datos del objeto req.file. creado por multer con la información del fichero original


### Data validation

Alternativas:

- [express-validator](https://www.npmjs.com/package/express-validator) (606.083) - FEM Course
- [express-validation](https://www.npmjs.com/package/express-validation) (66.579) - Bootcamp-Bcn
  - usa [joi](https://www.npmjs.com/package/joi) (8.645.843): schema description language and data validator

### Express-validation and joi

```shell
npm i express-validation
```

Se complementan las entities con los correspondientes Schemas de joy

Se crea un middleware para los métodos de validación
de cada una de las rutas que lo necesiten

Se incorpora cada método a su ruta en el router
(Si los datos llegan como Form Data se pasan primero por el middleware que extra del form los datos de los campos file y texto)

Se actualiza el middleware de errores para que tenga en cuenta los errores de validación

## Courses

New endpoint for Angular Courses

- Entity Course and Joi.Schema
- Mongoose Schema and Model
- Mongoose repository
- Controller extends BaseController
- Router
- Update HomeController with the routes list
- Router reference in app
