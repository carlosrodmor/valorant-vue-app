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
