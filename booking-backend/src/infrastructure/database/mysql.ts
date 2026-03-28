import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST ?? "mysql",
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "password",
  database: process.env.DB_NAME ?? "booking",
  port: Number(process.env.DB_PORT ?? 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
  timezone: "Z",
});
