import type { DatabaseConfig } from "../types";

// Configuración del scraper
export const SCRAPER_CONFIG = {
  BASE_URL: process.env.OPGG_BASE_URL || "https://op.gg/valorant/statistics",
  USER_AGENT:
    process.env.SCRAPER_USER_AGENT ||
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  REQUEST_DELAY: 2000, // 2 segundos entre requests
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 30000, // 30 segundos
};

// Configuración de la base de datos
export const DATABASE_CONFIG: DatabaseConfig = {
  uri: process.env.MONGODB_URI || "mongodb://localhost:27017",
  dbName: process.env.MONGODB_DB_NAME || "valorant_stats",
  collections: {
    agents: "agent_stats",
    maps: "map_stats",
    weapons: "weapon_stats",
    scrapedData: "scraped_data",
  },
};

// Configuración del scheduler
export const SCHEDULER_CONFIG = {
  // Ejecutar cada lunes a las 3:00 AM
  CRON_SCHEDULE: "0 3 * * 1",
  TIMEZONE: "Europe/Madrid",
};
