import { ref, type Ref } from "vue";
import type { Agent, TopPlayer, HenrikAPIResponse, LeaderboardResponse } from "@/types";
import { useAppConfig } from "./useAppConfig";

// Usar configuración centralizada
const { apiConfig, isConfigValid, logConfig } = useAppConfig();

// Loggear configuración en desarrollo
logConfig();

export function useValorantAPI() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Función para obtener todos los agentes disponibles
  const fetchAllAgents = async (): Promise<Agent[]> => {
    try {
      const response = await fetch(
        `${apiConfig.value.valorantApiBase}/agents?isPlayableCharacter=true`
      );
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
      const response = await fetch(
        `${apiConfig.value.henrikApiBase}/v3/leaderboard/${region}/pc?size=${size}`,
        {
          headers: {
            Authorization: apiConfig.value.henrikApiKey,
          },
        }
      );

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
      const response = await fetch(`${apiConfig.value.henrikApiBase}/v3/leaderboard/eu/pc?size=1`, {
        headers: {
          Authorization: apiConfig.value.henrikApiKey,
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
    isConfigValid,
    fetchAllAgents,
    fetchTopPlayers,
    checkHenrikAPIConnection,
  };
}
