## Boilerplate NodeJS Typescript API - by Fernando Calixto
## (Current Stack: ExpressJS, TypeORM, Typescript and PostgreSQL)

--------------------------------------

### How to Run This Project:
Follow the steps below to run and test the API:

1 - Create a local postgres DB using docker

```
$ sudo docker run --name nodeapi -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=nodeapi -e POSTGRES_USER=nodeapi -p 5432:5432 -d postgres
```

PS: If you rather, in the "data-source.ts" file, you can setup different database connections before running (development, test, production, etc).

2 - After creating the database and starting the docker container, install the dependencies using "yarn" or "npm"

3 - Run the migrations and seeds

```
$ typeorm migration:run && typeorm seed:run
```

4 - Now, you can run the server using "yarn/npm start".

### Next Steps to Improve This Project:
- Add swagger
- Add tests
