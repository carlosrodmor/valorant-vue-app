import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import { config } from "dotenv";
import { DatabaseManager } from "../scraper/database";

// Cargar variables de entorno
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Instancia del database manager
const dbManager = new DatabaseManager();

// Conectar a MongoDB al iniciar el servidor
dbManager.connect().catch(console.error);

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
    console.error("Error getting latest data:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Error interno del servidor",
    });
  }
});

app.get("/api/opgg/agents/:week?", async (req: Request, res: Response) => {
  try {
    const { week } = req.params;
    const agents = await dbManager.getAgentStats(week);
    res.json(agents);
  } catch (error) {
    console.error("Error getting agent stats:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Error obteniendo estadísticas de agentes",
    });
  }
});

app.get("/api/opgg/maps/:week?", async (req: Request, res: Response) => {
  try {
    const { week } = req.params;
    const maps = await dbManager.getMapStats(week);
    res.json(maps);
  } catch (error) {
    console.error("Error getting map stats:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Error obteniendo estadísticas de mapas",
    });
  }
});

app.get("/api/opgg/weapons/:week?", async (req: Request, res: Response) => {
  try {
    const { week } = req.params;
    const weapons = await dbManager.getWeaponStats(week);
    res.json(weapons);
  } catch (error) {
    console.error("Error getting weapon stats:", error);
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
    console.error("Error getting weeks:", error);
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

// Manejo de errores - usando @ts-ignore para evitar advertencia sobre parámetro no utilizado
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
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

export default app;
