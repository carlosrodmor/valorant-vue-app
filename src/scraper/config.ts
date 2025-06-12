import type { DatabaseConfig } from "../types";

// Validación de variables de entorno
const validateEnvVar = (varName: string, defaultValue?: string): string => {
  const value = process.env[varName] || defaultValue;
  if (!value) {
    throw new Error(`Variable de entorno requerida no encontrada: ${varName}`);
  }
  return value;
};

// Configuración del scraper con validaciones de seguridad
export const SCRAPER_CONFIG = {
  BASE_URL: validateEnvVar("OPGG_BASE_URL", "https://op.gg/valorant/statistics"),
  USER_AGENT: validateEnvVar(
    "SCRAPER_USER_AGENT",
    "ValorantStatsBot/1.0 (+https://github.com/tu-usuario/valorant-vue-app)"
  ),
  REQUEST_DELAY: Math.max(2000, parseInt(process.env.SCRAPER_REQUEST_DELAY || "2000")), // Mínimo 2 segundos
  RETRY_ATTEMPTS: Math.min(5, Math.max(1, parseInt(process.env.SCRAPER_RETRY_ATTEMPTS || "3"))), // Entre 1 y 5
  TIMEOUT: Math.min(60000, Math.max(10000, parseInt(process.env.SCRAPER_TIMEOUT || "30000"))), // Entre 10s y 60s
  MAX_CONCURRENT_REQUESTS: 1, // Solo 1 request concurrente para ser respetuosos
  RESPECT_ROBOTS_TXT: true,
  // Headers adicionales de seguridad
  ADDITIONAL_HEADERS: {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.8,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    DNT: "1",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Cache-Control": "max-age=0",
  },
};

// Configuración de la base de datos con validaciones
export const DATABASE_CONFIG: DatabaseConfig = {
  uri: validateEnvVar("MONGODB_URI", "mongodb://localhost:27017"),
  dbName: validateEnvVar("MONGODB_DB_NAME", "valorant_stats"),
  collections: {
    agents: "agent_stats",
    maps: "map_stats",
    weapons: "weapon_stats",
    scrapedData: "scraped_data",
  },
  // Opciones de conexión seguras
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Usar IPv4
    retryWrites: true,
    w: "majority",
  },
};

// Configuración del scheduler con validaciones
export const SCHEDULER_CONFIG = {
  CRON_SCHEDULE: process.env.CRON_SCHEDULE || "0 3 * * 1", // Lunes a las 3:00 AM por defecto
  TIMEZONE: process.env.TIMEZONE || "Europe/Madrid",
  MAX_EXECUTION_TIME: 30 * 60 * 1000, // 30 minutos máximo
  ENABLE_SCHEDULER: process.env.NODE_ENV !== "test", // Deshabilitado en tests
};

// Configuración de logging seguro
export const LOGGING_CONFIG = {
  LEVEL: process.env.LOG_LEVEL || "info",
  FILE: process.env.LOG_FILE || "logs/scraper.log",
  MAX_FILE_SIZE: "10m",
  MAX_FILES: 5,
  // No loggear información sensible
  SANITIZE_LOGS: true,
  SENSITIVE_FIELDS: ["password", "token", "key", "secret", "auth"],
};

// Validar configuración al cargar el módulo
const validateConfig = () => {
  // Validar URL base
  try {
    new URL(SCRAPER_CONFIG.BASE_URL);
  } catch {
    throw new Error("OPGG_BASE_URL no es una URL válida");
  }

  // Validar URI de MongoDB
  if (
    !DATABASE_CONFIG.uri.startsWith("mongodb://") &&
    !DATABASE_CONFIG.uri.startsWith("mongodb+srv://")
  ) {
    throw new Error("MONGODB_URI debe comenzar con mongodb:// o mongodb+srv://");
  }

  // Validar cron schedule
  const cronRegex =
    /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;
  if (!cronRegex.test(SCHEDULER_CONFIG.CRON_SCHEDULE)) {
    console.warn("CRON_SCHEDULE puede no ser válido, usando valor por defecto");
  }
};

// Ejecutar validación
if (process.env.NODE_ENV !== "test") {
  validateConfig();
}
