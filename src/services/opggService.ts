import type { OpggScrapedData, OpggAgentStats, OpggMapStats, OpggWeaponStats } from "../types";

export class OpggService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = "/api/opgg") {
    this.baseUrl = baseUrl;
  }

  /**
   * Obtiene los datos más recientes de op.gg
   */
  async getLatestData(): Promise<OpggScrapedData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/latest`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error obteniendo datos recientes:", error);
      return null;
    }
  }

  /**
   * Obtiene estadísticas de agentes para una semana específica
   */
  async getAgentStats(week?: string): Promise<OpggAgentStats[]> {
    try {
      const url = week ? `${this.baseUrl}/agents?week=${week}` : `${this.baseUrl}/agents`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error obteniendo estadísticas de agentes:", error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas de mapas para una semana específica
   */
  async getMapStats(week?: string): Promise<OpggMapStats[]> {
    try {
      const url = week ? `${this.baseUrl}/maps?week=${week}` : `${this.baseUrl}/maps`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error obteniendo estadísticas de mapas:", error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas de armas para una semana específica
   */
  async getWeaponStats(week?: string): Promise<OpggWeaponStats[]> {
    try {
      const url = week ? `${this.baseUrl}/weapons?week=${week}` : `${this.baseUrl}/weapons`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error obteniendo estadísticas de armas:", error);
      return [];
    }
  }

  /**
   * Obtiene lista de semanas disponibles
   */
  async getAvailableWeeks(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/weeks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error obteniendo semanas disponibles:", error);
      return [];
    }
  }

  /**
   * Compara estadísticas entre dos semanas
   */
  async compareWeeks(
    week1: string,
    week2: string
  ): Promise<{
    agents: { week1: OpggAgentStats[]; week2: OpggAgentStats[] };
    maps: { week1: OpggMapStats[]; week2: OpggMapStats[] };
    weapons: { week1: OpggWeaponStats[]; week2: OpggWeaponStats[] };
  } | null> {
    try {
      const [agents1, agents2, maps1, maps2, weapons1, weapons2] = await Promise.all([
        this.getAgentStats(week1),
        this.getAgentStats(week2),
        this.getMapStats(week1),
        this.getMapStats(week2),
        this.getWeaponStats(week1),
        this.getWeaponStats(week2),
      ]);

      return {
        agents: { week1: agents1, week2: agents2 },
        maps: { week1: maps1, week2: maps2 },
        weapons: { week1: weapons1, week2: weapons2 },
      };
    } catch (error) {
      console.error("Error comparando semanas:", error);
      return null;
    }
  }

  /**
   * Utilidades para procesar datos
   */
  static parsePickRate(pickRate: string): number {
    return parseFloat(pickRate.replace("%", "")) || 0;
  }

  static parseWinRate(winRate: string): number {
    return parseFloat(winRate.replace("%", "")) || 0;
  }

  static parseKDA(kda: string): number {
    return parseFloat(kda) || 0;
  }

  /**
   * Ordena agentes por pick rate descendente
   */
  static sortByPickRate(agents: OpggAgentStats[]): OpggAgentStats[] {
    return [...agents].sort(
      (a, b) => this.parsePickRate(b.pickRate) - this.parsePickRate(a.pickRate)
    );
  }

  /**
   * Ordena agentes por win rate descendente
   */
  static sortByWinRate(agents: OpggAgentStats[]): OpggAgentStats[] {
    return [...agents].sort((a, b) => this.parseWinRate(b.winRate) - this.parseWinRate(a.winRate));
  }

  /**
   * Filtra agentes por tier
   */
  static filterByTier(agents: OpggAgentStats[], tier: string): OpggAgentStats[] {
    return agents.filter((agent) => agent.tier.toLowerCase().includes(tier.toLowerCase()));
  }

  /**
   * Obtiene los top N agentes por pick rate
   */
  static getTopAgentsByPickRate(agents: OpggAgentStats[], limit: number = 5): OpggAgentStats[] {
    return this.sortByPickRate(agents).slice(0, limit);
  }

  /**
   * Obtiene los top N mapas por pick rate
   */
  static getTopMapsByPickRate(maps: OpggMapStats[], limit: number = 5): OpggMapStats[] {
    return [...maps]
      .sort((a, b) => this.parsePickRate(b.pickRate) - this.parsePickRate(a.pickRate))
      .slice(0, limit);
  }

  /**
   * Calcula estadísticas agregadas
   */
  static calculateAggregateStats(agents: OpggAgentStats[]): {
    avgPickRate: number;
    avgWinRate: number;
    totalAgents: number;
    topTier: string;
  } {
    if (!agents.length) {
      return { avgPickRate: 0, avgWinRate: 0, totalAgents: 0, topTier: "" };
    }

    const totalPickRate = agents.reduce(
      (sum, agent) => sum + this.parsePickRate(agent.pickRate),
      0
    );
    const totalWinRate = agents.reduce((sum, agent) => sum + this.parseWinRate(agent.winRate), 0);

    // Encontrar el tier más común
    const tierCounts = agents.reduce((acc, agent) => {
      acc[agent.tier] = (acc[agent.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTier = Object.entries(tierCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "";

    return {
      avgPickRate: totalPickRate / agents.length,
      avgWinRate: totalWinRate / agents.length,
      totalAgents: agents.length,
      topTier,
    };
  }
}

// Instancia singleton para usar en toda la aplicación
export const opggService = new OpggService();
