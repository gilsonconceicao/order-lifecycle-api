# Order lifecycle

REST API in **Node with TypeScript** for order management and control delivery

## Technologies

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- Docker

### how to run the project

#### Docker

```
docker-compose up -d --build
```

Stopping the containers

```
docker-compose down
```
Rebuilding the application

```
docker-compose up -d --build
```

#### Manual run the project
```
npm install
npm run migration:run
npm run seed
npm run dev
```