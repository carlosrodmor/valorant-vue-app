import { config } from "dotenv";
import * as cron from "node-cron";
import { main as runScraper } from "./index";
import { SCHEDULER_CONFIG } from "./config";

// Cargar variables de entorno
config();

class ScrapingScheduler {
  private task: cron.ScheduledTask | null = null;

  constructor() {
    console.log("📅 Scheduler de scraping iniciado");
    console.log(`🕐 Programado para ejecutar: ${SCHEDULER_CONFIG.CRON_SCHEDULE}`);
    console.log(`🌍 Zona horaria: ${SCHEDULER_CONFIG.TIMEZONE}`);
  }

  start(): void {
    // Validar el cron expression
    if (!cron.validate(SCHEDULER_CONFIG.CRON_SCHEDULE)) {
      throw new Error(`Cron expression inválida: ${SCHEDULER_CONFIG.CRON_SCHEDULE}`);
    }

    this.task = cron.schedule(
      SCHEDULER_CONFIG.CRON_SCHEDULE,
      async () => {
        console.log("\n🔔 Ejecutando scraping programado...");
        console.log("⏰ Timestamp:", new Date().toISOString());

        try {
          await runScraper();
          console.log("✅ Scraping programado completado exitosamente\n");
        } catch (error) {
          console.error("❌ Error en scraping programado:", error);

          // Enviar notificación de error (aquí podrías integrar con servicios como Discord, Slack, etc.)
          await this.sendErrorNotification(error);
        }
      },
      {
        timezone: SCHEDULER_CONFIG.TIMEZONE,
        scheduled: true,
      }
    );

    console.log("✅ Scheduler activado");
    this.logNextRun();
  }

  stop(): void {
    if (this.task) {
      this.task.stop();
      console.log("🛑 Scheduler detenido");
    }
  }

  destroy(): void {
    if (this.task) {
      this.task.destroy();
      console.log("🗑️ Scheduler destruido");
    }
  }

  private logNextRun(): void {
    if (this.task) {
      // Calcular próxima ejecución
      const nextRun = this.calculateNextRun();
      console.log(`📅 Próxima ejecución programada: ${nextRun.toLocaleString()}`);
    }
  }

  private calculateNextRun(): Date {
    // Lógica simple para calcular la próxima ejecución
    // Para el cron '0 3 * * 1' (lunes a las 3:00 AM)
    const now = new Date();
    const nextMonday = new Date();

    // Encontrar el próximo lunes
    const daysUntilMonday = (7 - now.getDay() + 1) % 7 || 7;
    nextMonday.setDate(now.getDate() + daysUntilMonday);
    nextMonday.setHours(3, 0, 0, 0);

    // Si ya pasó la hora de hoy y es lunes, programar para el próximo lunes
    if (now.getDay() === 1 && now.getHours() >= 3) {
      nextMonday.setDate(nextMonday.getDate() + 7);
    }

    return nextMonday;
  }

  private async sendErrorNotification(error: unknown): Promise<void> {
    // Aquí puedes implementar notificaciones por email, Discord, Slack, etc.
    console.error("📧 Enviando notificación de error...");

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Ejemplo de log estructurado para integrar con servicios de monitoreo
    const errorLog = {
      timestamp: new Date().toISOString(),
      service: "valorant-scraper",
      level: "error",
      message: "Scraping job failed",
      error: errorMessage,
      jobType: "scheduled-scraping",
    };

    console.error("Error log:", JSON.stringify(errorLog, null, 2));

    // TODO: Implementar notificaciones reales
    // - Email usando nodemailer
    // - Discord webhook
    // - Slack webhook
    // - Telegram bot
    // - SMS usando Twilio
  }

  // Método para ejecutar manualmente
  async runNow(): Promise<void> {
    console.log("🚀 Ejecutando scraping manual...");
    try {
      await runScraper();
      console.log("✅ Scraping manual completado");
    } catch (error) {
      console.error("❌ Error en scraping manual:", error);
      throw error;
    }
  }

  getStatus(): {
    isRunning: boolean;
    nextRun: Date | null;
    cronExpression: string;
    timezone: string;
  } {
    return {
      isRunning: this.task !== null,
      nextRun: this.task ? this.calculateNextRun() : null,
      cronExpression: SCHEDULER_CONFIG.CRON_SCHEDULE,
      timezone: SCHEDULER_CONFIG.TIMEZONE,
    };
  }
}

// Función principal para ejecutar el scheduler
async function startScheduler(): Promise<void> {
  const scheduler = new ScrapingScheduler();

  // Capturar señales para cerrar gracefully
  process.on("SIGINT", () => {
    console.log("\n📤 Recibida señal SIGINT, cerrando scheduler...");
    scheduler.destroy();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("\n📤 Recibida señal SIGTERM, cerrando scheduler...");
    scheduler.destroy();
    process.exit(0);
  });

  try {
    scheduler.start();

    // Mantener el proceso vivo
    console.log("🔄 Scheduler en ejecución. Presiona Ctrl+C para detener.");

    // Mostrar estado cada hora
    setInterval(() => {
      const status = scheduler.getStatus();
      console.log(`💡 Estado del scheduler: ${status.isRunning ? "Activo" : "Inactivo"}`);
      if (status.nextRun) {
        console.log(`📅 Próxima ejecución: ${status.nextRun.toLocaleString()}`);
      }
    }, 60 * 60 * 1000); // Cada hora
  } catch (error) {
    console.error("❌ Error iniciando scheduler:", error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.includes("--run-now")) {
    // Ejecutar inmediatamente
    const scheduler = new ScrapingScheduler();
    scheduler.runNow().catch((error) => {
      console.error("❌ Error ejecutando scraping:", error);
      process.exit(1);
    });
  } else {
    // Iniciar scheduler
    startScheduler();
  }
}

export { ScrapingScheduler, startScheduler };
