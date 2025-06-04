import { ref, type Ref } from "vue";
import type { Agent, TopPlayer, HenrikAPIResponse, LeaderboardResponse } from "@/types";

// Configuración de la API
const HENRIK_API_KEY = "HDEV-d0128b34-2c5d-4f1f-a04b-2a24ac422e7a";
const VALORANT_API_BASE = "https://valorant-api.com/v1";
const HENRIK_API_BASE = "https://api.henrikdev.xyz/valorant";

export function useValorantAPI() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Función para obtener todos los agentes disponibles
  const fetchAllAgents = async (): Promise<Agent[]> => {
    try {
      const response = await fetch(`${VALORANT_API_BASE}/agents?isPlayableCharacter=true`);
      const data = await response.json();

      if (data.status === 200 && data.data) {
        return data.data;
      }
      throw new Error("Error fetching agents");
    } catch (err) {
      console.error("Error fetching agents:", err);
      throw err;
    }
  };

  // Función para obtener top players
  const fetchTopPlayers = async (region = "eu", size = 5): Promise<TopPlayer[]> => {
    try {
      const response = await fetch(`${HENRIK_API_BASE}/v3/leaderboard/${region}/pc?size=${size}`, {
        headers: {
          Authorization: HENRIK_API_KEY,
        },
      });

      const data: HenrikAPIResponse<LeaderboardResponse> = await response.json();

      if (data.status === 200 && data.data?.players) {
        return data.data.players;
      }
      throw new Error("Error fetching top players");
    } catch (err) {
      console.error("Error fetching top players:", err);
      throw err;
    }
  };

  // Función para verificar conectividad con Henrik API
  const checkHenrikAPIConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${HENRIK_API_BASE}/v3/leaderboard/eu/pc?size=1`, {
        headers: {
          Authorization: HENRIK_API_KEY,
        },
      });

      const data = await response.json();
      return data.status === 200;
    } catch {
      return false;
    }
  };

  return {
    isLoading: isLoading as Ref<boolean>,
    error: error as Ref<string | null>,
    fetchAllAgents,
    fetchTopPlayers,
    checkHenrikAPIConnection,
  };
}
