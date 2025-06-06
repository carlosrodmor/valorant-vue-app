import { MongoClient, Db } from "mongodb";
import type { Collection, Document, Sort } from "mongodb";
import type { OpggScrapedData, OpggAgentStats, OpggMapStats, OpggWeaponStats } from "../types";
import { DATABASE_CONFIG } from "./config";

export class DatabaseManager {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    this.client = new MongoClient(DATABASE_CONFIG.uri);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db(DATABASE_CONFIG.dbName);
      console.log(`✅ Conectado a MongoDB: ${DATABASE_CONFIG.dbName}`);
    } catch (error) {
      console.error("❌ Error conectando a MongoDB:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.close();
      console.log("✅ Desconectado de MongoDB");
    } catch (error) {
      console.error("❌ Error desconectando de MongoDB:", error);
    }
  }

  private getCollection<T extends Document>(collectionName: string): Collection<T> {
    if (!this.db) {
      throw new Error("Base de datos no conectada");
    }
    return this.db.collection<T>(collectionName);
  }

  async saveScrapedData(data: OpggScrapedData): Promise<void> {
    try {
      const collection = this.getCollection<OpggScrapedData & Document>(
        DATABASE_CONFIG.collections.scrapedData
      );

      // Eliminar datos de la misma semana si existen
      await collection.deleteMany({ week: data.week });

      // Insertar nuevos datos
      await collection.insertOne(data);
      console.log(`✅ Datos guardados para la semana: ${data.week}`);
    } catch (error) {
      console.error("❌ Error guardando datos completos:", error);
      throw error;
    }
  }

  async saveAgentStats(agents: OpggAgentStats[], week: string): Promise<void> {
    try {
      const collection = this.getCollection<
        OpggAgentStats & { week: string; updatedAt: Date } & Document
      >(DATABASE_CONFIG.collections.agents);

      // Eliminar estadísticas de agentes de la misma semana
      await collection.deleteMany({ week });

      // Añadir la semana a cada registro y insertar
      const agentsWithWeek = agents.map((agent) => ({ ...agent, week, updatedAt: new Date() }));
      await collection.insertMany(agentsWithWeek);
      console.log(`✅ Estadísticas de ${agents.length} agentes guardadas`);
    } catch (error) {
      console.error("❌ Error guardando estadísticas de agentes:", error);
      throw error;
    }
  }

  async saveMapStats(maps: OpggMapStats[], week: string): Promise<void> {
    try {
      const collection = this.getCollection<
        OpggMapStats & { week: string; updatedAt: Date } & Document
      >(DATABASE_CONFIG.collections.maps);

      // Eliminar estadísticas de mapas de la misma semana
      await collection.deleteMany({ week });

      // Añadir la semana a cada registro y insertar
      const mapsWithWeek = maps.map((map) => ({ ...map, week, updatedAt: new Date() }));
      await collection.insertMany(mapsWithWeek);
      console.log(`✅ Estadísticas de ${maps.length} mapas guardadas`);
    } catch (error) {
      console.error("❌ Error guardando estadísticas de mapas:", error);
      throw error;
    }
  }

  async saveWeaponStats(weapons: OpggWeaponStats[], week: string): Promise<void> {
    try {
      const collection = this.getCollection<
        OpggWeaponStats & { week: string; updatedAt: Date } & Document
      >(DATABASE_CONFIG.collections.weapons);

      // Eliminar estadísticas de armas de la misma semana
      await collection.deleteMany({ week });

      // Añadir la semana a cada registro y insertar
      const weaponsWithWeek = weapons.map((weapon) => ({ ...weapon, week, updatedAt: new Date() }));
      await collection.insertMany(weaponsWithWeek);
      console.log(`✅ Estadísticas de ${weapons.length} armas guardadas`);
    } catch (error) {
      console.error("❌ Error guardando estadísticas de armas:", error);
      throw error;
    }
  }

  async getLatestData(): Promise<OpggScrapedData | null> {
    try {
      const collection = this.getCollection<OpggScrapedData & Document>(
        DATABASE_CONFIG.collections.scrapedData
      );
      const data = await collection.findOne({}, { sort: { scrapedAt: -1 } });
      return data;
    } catch (error) {
      console.error("❌ Error obteniendo últimos datos:", error);
      return null;
    }
  }

  async getAgentStatsForWeek(week: string): Promise<OpggAgentStats[]> {
    try {
      const collection = this.getCollection<
        OpggAgentStats & { week: string; updatedAt: Date } & Document
      >(DATABASE_CONFIG.collections.agents);
      const agents = await collection.find({ week }).toArray();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return agents.map(({ week: _w, updatedAt: _u, ...agent }) => agent);
    } catch (error) {
      console.error("❌ Error obteniendo estadísticas de agentes:", error);
      return [];
    }
  }

  async getAgentStats(week?: string): Promise<OpggAgentStats[]> {
    try {
      const collection = this.getCollection<
        OpggAgentStats & { week: string; updatedAt: Date } & Document
      >(DATABASE_CONFIG.collections.agents);

      let query = {};
      if (week) {
        query = { week };
      }

      // Si no se especifica semana, obtenemos los más recientes
      const sortOptions: Sort = week ? {} : { updatedAt: -1 };

      const agents = await collection.find(query).sort(sortOptions).toArray();

      // Si no hay semana específica, filtramos para obtener solo los agentes de la semana más reciente
      if (!week && agents.length > 0) {
        const latestWeek = agents[0].week;

        return (
          agents
            .filter((agent) => agent.week === latestWeek)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ week: _w, updatedAt: _u, ...agent }) => agent)
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return agents.map(({ week: _w, updatedAt: _u, ...agent }) => agent);
    } catch (error) {
      console.error("❌ Error obteniendo estadísticas de agentes:", error);
      return [];
    }
  }

  async getMapStats(week?: string): Promise<OpggMapStats[]> {
    try {
      const collection = this.getCollection<
        OpggMapStats & { week: string; updatedAt: Date } & Document
      >(DATABASE_CONFIG.collections.maps);

      let query = {};
      if (week) {
        query = { week };
      }

      // Si no se especifica semana, obtenemos los más recientes
      const sortOptions: Sort = week ? {} : { updatedAt: -1 };

      const maps = await collection.find(query).sort(sortOptions).toArray();

      // Si no hay semana específica, filtramos para obtener solo los mapas de la semana más reciente
      if (!week && maps.length > 0) {
        const latestWeek = maps[0].week;

        return (
          maps
            .filter((map) => map.week === latestWeek)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ week: _w, updatedAt: _u, ...map }) => map)
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return maps.map(({ week: _w, updatedAt: _u, ...map }) => map);
    } catch (error) {
      console.error("❌ Error obteniendo estadísticas de mapas:", error);
      return [];
    }
  }

  async getWeaponStats(week?: string): Promise<OpggWeaponStats[]> {
    try {
      const collection = this.getCollection<
        OpggWeaponStats & { week: string; updatedAt: Date } & Document
      >(DATABASE_CONFIG.collections.weapons);

      let query = {};
      if (week) {
        query = { week };
      }

      // Si no se especifica semana, obtenemos los más recientes
      const sortOptions: Sort = week ? {} : { updatedAt: -1 };

      const weapons = await collection.find(query).sort(sortOptions).toArray();

      // Si no hay semana específica, filtramos para obtener solo las armas de la semana más reciente
      if (!week && weapons.length > 0) {
        const latestWeek = weapons[0].week;

        return (
          weapons
            .filter((weapon) => weapon.week === latestWeek)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(({ week: _w, updatedAt: _u, ...weapon }) => weapon)
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return weapons.map(({ week: _w, updatedAt: _u, ...weapon }) => weapon);
    } catch (error) {
      console.error("❌ Error obteniendo estadísticas de armas:", error);
      return [];
    }
  }

  async getWeeks(): Promise<string[]> {
    try {
      const collection = this.getCollection<OpggScrapedData & Document>(
        DATABASE_CONFIG.collections.scrapedData
      );

      const weeks = await collection.distinct("week");
      return weeks.sort().reverse(); // Ordenar descendente para tener las semanas más recientes primero
    } catch (error) {
      console.error("❌ Error obteniendo listado de semanas:", error);
      return [];
    }
  }

  async createIndexes(): Promise<void> {
    try {
      if (!this.db) return;

      // Índices para la colección principal
      await this.db
        .collection(DATABASE_CONFIG.collections.scrapedData)
        .createIndex({ week: 1 }, { unique: true });
      await this.db
        .collection(DATABASE_CONFIG.collections.scrapedData)
        .createIndex({ scrapedAt: -1 });

      // Índices para estadísticas específicas
      await this.db
        .collection(DATABASE_CONFIG.collections.agents)
        .createIndex({ week: 1, agentName: 1 });
      await this.db
        .collection(DATABASE_CONFIG.collections.maps)
        .createIndex({ week: 1, mapName: 1 });
      await this.db
        .collection(DATABASE_CONFIG.collections.weapons)
        .createIndex({ week: 1, weaponName: 1 });

      console.log("✅ Índices de base de datos creados");
    } catch (error) {
      console.error("❌ Error creando índices:", error);
    }
  }
}
