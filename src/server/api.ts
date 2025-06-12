import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import { config } from "dotenv";
import { DatabaseManager } from "../scraper/database";

// Cargar variables de entorno
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting simple
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutos
const RATE_LIMIT_MAX_REQUESTS = 100; // máximo 100 requests por ventana

// Middleware de rate limiting
const rateLimit = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  const clientData = rateLimitMap.get(clientIP);

  if (!clientData || now > clientData.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      error: "Too Many Requests",
      message: "Has excedido el límite de requests. Intenta de nuevo más tarde.",
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  }

  clientData.count++;
  next();
};

// Validación de parámetros
const validateWeekParam = (week: string): boolean => {
  if (!week) return true; // week es opcional
  // Formato esperado: YYYY-WXX (ej: 2024-W01)
  const weekRegex = /^\d{4}-W\d{2}$/;
  return weekRegex.test(week) && week.length <= 8;
};

const sanitizeInput = (input: string): string => {
  return input.replace(/[<>\"'&]/g, '').trim().substring(0, 50);
};

// Middlewares de seguridad
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://tu-dominio.com'] // Reemplaza con tu dominio real
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(rateLimit);

// Headers de seguridad
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Instancia del database manager
const dbManager = new DatabaseManager();

// Conectar a MongoDB al iniciar el servidor
dbManager.connect().catch((error) => {
  console.error("Error crítico conectando a la base de datos:", error.message);
  process.exit(1);
});

// Rutas de la API
app.get("/api/opgg/latest", async (req: Request, res: Response) => {
  try {
    const latestData = await dbManager.getLatestData();

    if (!latestData) {
      return res.status(404).json({
        error: "No data found",
        message: "No se encontraron datos en la base de datos",
      });
    }

    res.json(latestData);
  } catch (error) {
    console.error("Error getting latest data:", error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      error: "Internal server error",
      message: "Error interno del servidor",
    });
  }
});

app.get("/api/opgg/agents/:week?", async (req: Request, res: Response) => {
  try {
    const { week } = req.params;

    // Validar parámetro week
    if (week && !validateWeekParam(week)) {
      return res.status(400).json({
        error: "Invalid parameter",
        message: "El parámetro 'week' debe tener el formato YYYY-WXX"
      });
    }

    const sanitizedWeek = week ? sanitizeInput(week) : undefined;
    const agents = await dbManager.getAgentStats(sanitizedWeek);
    res.json(agents);
  } catch (error) {
    console.error("Error getting agent stats:", error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      error: "Internal server error",
      message: "Error obteniendo estadísticas de agentes",
    });
  }
});

app.get("/api/opgg/maps/:week?", async (req: Request, res: Response) => {
  try {
    const { week } = req.params;

    // Validar parámetro week
    if (week && !validateWeekParam(week)) {
      return res.status(400).json({
        error: "Invalid parameter",
        message: "El parámetro 'week' debe tener el formato YYYY-WXX"
      });
    }

    const sanitizedWeek = week ? sanitizeInput(week) : undefined;
    const maps = await dbManager.getMapStats(sanitizedWeek);
    res.json(maps);
  } catch (error) {
    console.error("Error getting map stats:", error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      error: "Internal server error",
      message: "Error obteniendo estadísticas de mapas",
    });
  }
});

app.get("/api/opgg/weapons/:week?", async (req: Request, res: Response) => {
  try {
    const { week } = req.params;

    // Validar parámetro week
    if (week && !validateWeekParam(week)) {
      return res.status(400).json({
        error: "Invalid parameter",
        message: "El parámetro 'week' debe tener el formato YYYY-WXX"
      });
    }

    const sanitizedWeek = week ? sanitizeInput(week) : undefined;
    const weapons = await dbManager.getWeaponStats(sanitizedWeek);
    res.json(weapons);
  } catch (error) {
    console.error("Error getting weapon stats:", error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      error: "Internal server error",
      message: "Error obteniendo estadísticas de armas",
    });
  }
});

app.get("/api/opgg/weeks", async (_req: Request, res: Response) => {
  try {
    const weeks = await dbManager.getWeeks();
    res.json(weeks);
  } catch (error) {
    console.error("Error getting weeks:", error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      error: "Internal server error",
      message: "Error obteniendo listado de semanas",
    });
  }
});

// Ruta de salud
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "API funcionando correctamente",
  });
});

// Manejo de rutas no encontradas
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: "Endpoint no encontrado"
  });
});

// Manejo de errores - usando @ts-ignore para evitar advertencia sobre parámetro no utilizado
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    error: "Internal server error",
    message: "Error interno del servidor",
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Latest data: http://localhost:${PORT}/api/opgg/latest`);
});

// Manejar cierre adecuado
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    // Cerrar conexión a MongoDB
    dbManager.disconnect().catch(console.error);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    dbManager.disconnect().catch(console.error);
    process.exit(0);
  });
});

export default app;
