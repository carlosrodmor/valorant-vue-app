// Tipos principales de Valorant
export interface AgentRole {
  uuid: string;
  displayName: string;
  displayIcon: string;
}

export interface Agent {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
  role: AgentRole;
}

export interface TopPlayer {
  puuid: string;
  name: string;
  tag: string;
  leaderboard_rank: number;
  tier: number;
  rr: number;
  wins: number;
}

export interface AgentStats {
  pickRate: string;
  winRate: string;
}

export interface AgentWithStats extends Agent {
  stats?: AgentStats;
}

// Tipos para la API de Henrik
export interface HenrikAPIResponse<T> {
  status: number;
  data?: T;
}

export interface LeaderboardResponse {
  players: TopPlayer[];
  updated_at: string;
}

// Tipos para componentes
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface AgentStatsData {
  [agentName: string]: AgentStats;
}

// Tipos para datos de op.gg scraped
export interface OpggAgentStats {
  agentName: string;
  agentIcon: string;
  tier: string;
  pickRate: string;
  winRate: string;
  avgKDA: string;
  avgScore: string;
  avgDamage: string;
  position?: string; // Para casos donde el agente tenga posición específica
}

export interface OpggMapStats {
  mapName: string;
  mapIcon: string;
  pickRate: string;
  winRateAttack: string;
  winRateDefense: string;
  avgRounds: string;
}

export interface OpggWeaponStats {
  weaponName: string;
  weaponIcon: string;
  pickRate: string;
  killRate: string;
  headshotRate: string;
  avgDamage: string;
}

export interface OpggScrapedData {
  agents: OpggAgentStats[];
  maps: OpggMapStats[];
  weapons: OpggWeaponStats[];
  scrapedAt: Date;
  week: string; // Formato: "2024-W01"
}

// Tipos para MongoDB
export interface DatabaseConfig {
  uri: string;
  dbName: string;
  collections: {
    agents: string;
    maps: string;
    weapons: string;
    scrapedData: string;
  };
  options?: {
    maxPoolSize?: number;
    serverSelectionTimeoutMS?: number;
    socketTimeoutMS?: number;
    family?: number;
    retryWrites?: boolean;
    w?: string | number;
    ssl?: boolean;
    sslValidate?: boolean;
    authSource?: string;
  };
}
