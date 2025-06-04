<template>
  <div class="home-container">
    <!-- Fondo animado con todos los efectos -->
    <AnimatedBackground />

    <!-- Contenido principal -->
    <div class="content-wrapper">
      <div class="hero-section">
        <!-- Header de la marca -->
        <BrandHeader />

        <!-- Sección de Agentes Destacados -->
        <AgentList
          v-if="featuredAgents.length > 0"
          :agents="featuredAgents"
          :selected-agent="selectedAgent"
          :get-agent-pick-rate="getAgentPickRate"
          :get-agent-win-rate="getAgentWinRate"
          @agent-selected="selectAgent"
        />

        <!-- Sección de Top Players -->
        <PlayerList
          v-if="topPlayers.length > 0"
          :players="topPlayers"
          :get-tier-name="getTierName"
        />

        <!-- Loading state -->
        <LoadingSpinner v-else-if="isLoading" text="Cargando agentes..." />

        <!-- Call to action -->
        <CTAButton text="Explorar Datos" @click="handleCTAClick" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Agent, TopPlayer } from "@/types";
import { useValorantAPI } from "@/composables/useValorantAPI";
import { useAgentStats } from "@/composables/useAgentStats";

// Componentes
import AnimatedBackground from "@/components/home/AnimatedBackground.vue";
import BrandHeader from "@/components/home/BrandHeader.vue";
import AgentList from "@/components/agents/AgentList.vue";
import PlayerList from "@/components/players/PlayerList.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import CTAButton from "@/components/ui/CTAButton.vue";

// Estados reactivos
const featuredAgents = ref<Agent[]>([]);
const selectedAgent = ref<Agent | null>(null);
const topPlayers = ref<TopPlayer[]>([]);
const isLoading = ref(true);

// Composables
const { fetchAllAgents, fetchTopPlayers } = useValorantAPI();
const { generateDynamicStats, setFallbackStats, getAgentPickRate, getAgentWinRate, getTierName } =
  useAgentStats();

// Función principal para cargar agentes
const loadAgents = async () => {
  try {
    isLoading.value = true;

    // Obtener lista dinámica de agentes populares
    const popularAgentNames = await generateDynamicStats();

    // Obtener todos los agentes disponibles
    const allAgents = await fetchAllAgents();

    let selectedAgentNames: string[];

    // Si obtuvimos datos dinámicos, usarlos; sino usar fallback
    if (popularAgentNames && popularAgentNames.length > 0) {
      selectedAgentNames = popularAgentNames;
    } else {
      // Fallback con agentes populares conocidos
      selectedAgentNames = ["Jett", "Reyna", "Omen", "Sova", "Raze"];
      setFallbackStats();
    }

    // Filtrar y ordenar agentes según popularidad
    const orderedAgents = selectedAgentNames
      .map((name) => allAgents.find((agent: Agent) => agent.displayName === name))
      .filter((agent): agent is Agent => agent !== undefined);

    featuredAgents.value = orderedAgents.slice(0, 5);

    // Seleccionar el primer agente por defecto
    if (featuredAgents.value.length > 0) {
      selectedAgent.value = featuredAgents.value[0];
    }
  } catch (error) {
    console.error("Error al cargar agentes:", error);

    // En caso de error total, usar datos de emergencia
    setFallbackStats();
  } finally {
    isLoading.value = false;
  }
};

// Función para cargar top players
const loadTopPlayers = async () => {
  try {
    const players = await fetchTopPlayers("eu", 5);
    topPlayers.value = players;
  } catch (error) {
    console.error("Error al cargar top players:", error);
  }
};

// Función para seleccionar un agente
const selectAgent = (agent: Agent) => {
  selectedAgent.value = agent;
};

// Función para manejar click del CTA
const handleCTAClick = () => {
  console.log("CTA button clicked - implementar navegación");
  // Aquí se puede implementar navegación o alguna acción
};

onMounted(() => {
  // Cargar agentes y top players
  loadAgents();
  loadTopPlayers();
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: pageEnter 2s ease-out;
}

/* Contenido principal */
.content-wrapper {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.hero-section {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
  animation: fadeInScale 1.5s ease-out;
}

@keyframes pageEnter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.85);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-wrapper {
    padding: 0 1.5rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    gap: 3rem;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 0 1rem;
  }

  .hero-section {
    gap: 2.5rem;
  }
}
</style>
