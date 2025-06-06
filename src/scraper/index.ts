import { config } from "dotenv";
import { OpggScraper } from "./opgg-scraper";
import { DatabaseManager } from "./database";

// Cargar variables de entorno
config();

async function main() {
  const scraper = new OpggScraper();
  const dbManager = new DatabaseManager();

  try {
    console.log("🚀 Iniciando proceso de scraping de op.gg Valorant");
    console.log("⏰ Timestamp:", new Date().toISOString());

    // Conectar a la base de datos
    await dbManager.connect();
    await dbManager.createIndexes();

    // Scrapear todos los datos
    const scrapedData = await scraper.scrapeAllData();

    if (!scrapedData.agents.length && !scrapedData.maps.length && !scrapedData.weapons.length) {
      console.warn("⚠️ No se extrajeron datos. Verificar selectores CSS.");
      return;
    }

    // Guardar datos en la base de datos
    await dbManager.saveScrapedData(scrapedData);

    // Guardar también por categorías separadas para facilitar consultas
    if (scrapedData.agents.length > 0) {
      await dbManager.saveAgentStats(scrapedData.agents, scrapedData.week);
    }

    if (scrapedData.maps.length > 0) {
      await dbManager.saveMapStats(scrapedData.maps, scrapedData.week);
    }

    if (scrapedData.weapons.length > 0) {
      await dbManager.saveWeaponStats(scrapedData.weapons, scrapedData.week);
    }

    console.log("✅ Proceso completado exitosamente");
    console.log(`📊 Resumen final:`);
    console.log(`   - Agentes: ${scrapedData.agents.length}`);
    console.log(`   - Mapas: ${scrapedData.maps.length}`);
    console.log(`   - Armas: ${scrapedData.weapons.length}`);
    console.log(`   - Semana: ${scrapedData.week}`);
  } catch (error) {
    console.error("❌ Error en el proceso principal:", error);
    process.exit(1);
  } finally {
    await dbManager.disconnect();
  }
}

// Función para scrapear solo una categoría específica
async function scrapeCategory(category: "agents" | "maps" | "weapons") {
  const scraper = new OpggScraper();
  const dbManager = new DatabaseManager();

  try {
    console.log(`🚀 Scrapeando solo: ${category}`);

    await dbManager.connect();

    let data;
    const weekString =
      new Date().getFullYear() +
      "-W" +
      Math.ceil(
        (new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      );

    switch (category) {
      case "agents":
        data = await scraper.scrapeAgentStats();
        await dbManager.saveAgentStats(data, weekString);
        break;
      case "maps":
        data = await scraper.scrapeMapStats();
        await dbManager.saveMapStats(data, weekString);
        break;
      case "weapons":
        data = await scraper.scrapeWeaponStats();
        await dbManager.saveWeaponStats(data, weekString);
        break;
    }

    console.log(`✅ ${category} scrapeado exitosamente: ${data.length} elementos`);
  } catch (error) {
    console.error(`❌ Error scrapeando ${category}:`, error);
    process.exit(1);
  } finally {
    await dbManager.disconnect();
  }
}

// Ejecutar según argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.length > 0) {
  const category = args[0] as "agents" | "maps" | "weapons";
  if (["agents", "maps", "weapons"].includes(category)) {
    scrapeCategory(category);
  } else {
    console.error("❌ Categoría inválida. Usa: agents, maps, o weapons");
    process.exit(1);
  }
} else {
  main();
}

export { main, scrapeCategory };
