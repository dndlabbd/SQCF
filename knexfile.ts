import type { Knex } from "knex";
require("dotenv").config({ path: '.env.development' });
const config: Knex.Config = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    extension: "ts",
  },
};

module.exports = config;
