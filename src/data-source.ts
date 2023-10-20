// Core
import "reflect-metadata";
import { DataSource } from "typeorm";

// Entities
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "pokemonkai",
  password: "123456",
  database: "pokemonkai",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});
