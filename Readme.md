# About
This is express typescript boilerplate to build APIs.

# Folders
- `bin`: This folder contains files that initiates api server or console app.
- `config`: This folder contains json configs related to the app. This is based on `config` npm package.
- `context`: This folder contains the base logic for create context for the app.
- `controllers`: This folder contains all the controllers and their interfaces.
- `crons`: This folder contains all the cron job definitions.
- `db`: This folder contains db connection script, db models and their interfaces. This folder can be expanded to support multiple databases.
- `error`: This folder contains classes for application level error.
- `helpers`: This folder contains utility classes.
- `interfaces`: This folder contains global interfaces.
- `lib`: This folder contains standard classes and libraries used across application.
- `middlewares`: This folder contains express middlewares.
- `routes`: This folder contains all the route definitions.
- `services`: This folder contains all the services.

# Config
Defines app configurations.
- `API_PREFIX`
- `PORT`
- `MONGODB_URI`
- `MONGODB_DEBUG`
- `AUTH_SECRET_KEY`: This is used to generate the jwt token.

Run `yarn build` or `npm run build` every time you change the config.

# NPM Packages Used
- express
- config
- joi
- bluebird
- lodash
- body-parser
- cors
- jsonwebtoken
- express-jwt
- express-status-monitor - try later
- mongoose
- luxon
- chai
- mocha
- reflect-metadata
- winston
- helmet
- compression
- eslint (dev)
- @typescript-eslint/eslint-plugin  (dev)
- @typescript-eslint/parser  (dev)
- eslint-config-airbnb-base (dev)
- eslint-config-prettier (dev)
- eslint-plugin-import (dev)
- eslint-plugin-prettier (dev)
- nodemon (dev)
- prettier (dev)
- shx (dev)
- ts-node (dev)
- typescript (dev)
- mime-types

Run `npm install` at the root of the project to install all the packages.

# Steps to setup development environment
1. Make sure you have installed `npm` and `nodejs`.
2. Install `MongoDB`.
3. Go the root directory of the project.
4. Run `npm install`.
5. Make config changes.
6. Run `npm run build` or `yarn build`.
7. Run `npm run dev` or `yarn dev`.
8. Enjoy!