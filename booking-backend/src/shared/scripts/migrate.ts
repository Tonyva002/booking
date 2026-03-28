import fs from "fs";
import path from "path";
import { db } from "../../infrastructure/database/mysql";

async function ensureMigrationsTable() {
  await db.query(`
                CREATE TABLE IF NOT EXISTS migrations (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                `);
}

async function getExecutedMigrations(): Promise<string[]> {
  const [rows] = await db.query("SELECT name FROM migrations ORDER BY id ASC");
  return (rows as { name: string }[]).map((row) => row.name);
}

async function runMigrations() {
  console.log("Iniciando migraciones...");

  await ensureMigrationsTable();

  const migrationsPath = path.resolve(process.cwd(), "migrations");

  if (!fs.existsSync(migrationsPath)) {
    throw new Error(`No existe la carpeta de migraciones: ${migrationsPath}`);
  }

  const files = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const executed = await getExecutedMigrations();

  for (const file of files) {
    if (executed.includes(file)) {
      console.log(`Saltando ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsPath, file), "utf8");

    console.log(`Ejecutando ${file}...`);
    await db.query(sql);
    await db.query("INSERT INTO migrations (name) VALUES (?)", [file]);
    console.log(` ${file} ejecutada`);
  }

  console.log("Migraciones completadas");
  process.exit(0);
}


runMigrations().catch((err) => {
  console.error("Error ejecutando migraciones:", err);
  process.exit(1);
});




