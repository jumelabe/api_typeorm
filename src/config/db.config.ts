import { DataSource } from "typeorm";
import { User } from "../entity/user.entity";
import { config } from "./config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.database,
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
}); 