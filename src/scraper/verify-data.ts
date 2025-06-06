import { config } from "dotenv";
import { DatabaseManager } from "./database";

// Cargar variables de entorno
config();

async function verifyData() {
  const dbManager = new DatabaseManager();

  try {
    console.log("🔍 Verificando datos en MongoDB...");

    await dbManager.connect();

    // Obtener los últimos datos
    const latestData = await dbManager.getLatestData();

    if (latestData) {
      console.log("\n📊 Últimos datos encontrados:");
      console.log(`📅 Fecha de scraping: ${latestData.scrapedAt}`);
      console.log(`📅 Semana: ${latestData.week}`);
      console.log(`🎯 Agentes: ${latestData.agents.length}`);
      console.log(`🗺️ Mapas: ${latestData.maps.length}`);
      console.log(`🔫 Armas: ${latestData.weapons.length}`);

      if (latestData.agents.length > 0) {
        console.log("\n🎯 Primeros 5 agentes:");
        latestData.agents.slice(0, 5).forEach((agent, index) => {
          console.log(
            `${index + 1}. ${agent.agentName} - Pick Rate: ${agent.pickRate}, Win Rate: ${
              agent.winRate
            }`
          );
        });
      }

      // Obtener agentes con mejor pick rate
      const sortedAgents = latestData.agents
        .filter((agent) => agent.pickRate.includes("%"))
        .sort((a, b) => {
          const aRate = parseFloat(a.pickRate.replace("%", ""));
          const bRate = parseFloat(b.pickRate.replace("%", ""));
          return bRate - aRate;
        });

      if (sortedAgents.length > 0) {
        console.log("\n🏆 Top 5 agentes por Pick Rate:");
        sortedAgents.slice(0, 5).forEach((agent, index) => {
          console.log(
            `${index + 1}. ${agent.agentName} - ${agent.pickRate} pick rate, ${
              agent.winRate
            } win rate`
          );
        });
      }
    } else {
      console.log("❌ No se encontraron datos en la base de datos");
    }
  } catch (error) {
    console.error("❌ Error verificando datos:", error);
  } finally {
    await dbManager.disconnect();
  }
}

// Ejecutar
verifyData();
