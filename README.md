## Hardik Gadhiya
<p>-------------------------------------------------------------------</p>

## Description

[Chat Application]

## Installation

```bash
$ npm install
```

## For Generate Migration
```bash
$ npx sequelize-cli migration:generate --name create-group
```

## Migrate tables to DB
```bash
$ npx sequelize-cli db:migrate 
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```