<template>
  <div class="agents-view">
    <!-- Header Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="title-accent">TIER LIST</span>
          <span class="title-main">AGENTES</span>
        </h1>
        <p class="hero-description">
          Clasificación de agentes basada en su efectividad y popularidad en el meta actual
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-section">
      <div class="loading-spinner"></div>
      <p class="loading-text">Cargando agentes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-section">
      <div class="error-content">
        <h3 class="error-title">Error al cargar los datos</h3>
        <p class="error-message">{{ error }}</p>
        <button @click="loadAgents" class="retry-button">Reintentar</button>
      </div>
    </div>

    <!-- Tier List -->
    <div v-else class="tier-list-section">
      <div class="tier-container">
        <!-- S Tier -->
        <div class="tier-row tier-s">
          <div class="tier-label">
            <span class="tier-letter">S</span>
            <span class="tier-name">Meta</span>
          </div>
          <div class="tier-agents">
            <div
              v-for="agent in tierS"
              :key="agent.uuid"
              class="agent-card"
              :title="agent.displayName"
            >
              <img :src="agent.displayIcon" :alt="agent.displayName" class="agent-image" />
              <span class="agent-name">{{ agent.displayName }}</span>
              <div class="role-indicator" :class="`role-${agent.role.displayName.toLowerCase()}`">
                <img
                  :src="agent.role.displayIcon"
                  :alt="agent.role.displayName"
                  class="role-icon"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- A Tier -->
        <div class="tier-row tier-a">
          <div class="tier-label">
            <span class="tier-letter">A</span>
            <span class="tier-name">Fuerte</span>
          </div>
          <div class="tier-agents">
            <div
              v-for="agent in tierA"
              :key="agent.uuid"
              class="agent-card"
              :title="agent.displayName"
            >
              <img :src="agent.displayIcon" :alt="agent.displayName" class="agent-image" />
              <span class="agent-name">{{ agent.displayName }}</span>
              <div class="role-indicator" :class="`role-${agent.role.displayName.toLowerCase()}`">
                <img
                  :src="agent.role.displayIcon"
                  :alt="agent.role.displayName"
                  class="role-icon"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- B Tier -->
        <div class="tier-row tier-b">
          <div class="tier-label">
            <span class="tier-letter">B</span>
            <span class="tier-name">Viable</span>
          </div>
          <div class="tier-agents">
            <div
              v-for="agent in tierB"
              :key="agent.uuid"
              class="agent-card"
              :title="agent.displayName"
            >
              <img :src="agent.displayIcon" :alt="agent.displayName" class="agent-image" />
              <span class="agent-name">{{ agent.displayName }}</span>
              <div class="role-indicator" :class="`role-${agent.role.displayName.toLowerCase()}`">
                <img
                  :src="agent.role.displayIcon"
                  :alt="agent.role.displayName"
                  class="role-icon"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- C Tier -->
        <div class="tier-row tier-c">
          <div class="tier-label">
            <span class="tier-letter">C</span>
            <span class="tier-name">Situacional</span>
          </div>
          <div class="tier-agents">
            <div
              v-for="agent in tierC"
              :key="agent.uuid"
              class="agent-card"
              :title="agent.displayName"
            >
              <img :src="agent.displayIcon" :alt="agent.displayName" class="agent-image" />
              <span class="agent-name">{{ agent.displayName }}</span>
              <div class="role-indicator" :class="`role-${agent.role.displayName.toLowerCase()}`">
                <img
                  :src="agent.role.displayIcon"
                  :alt="agent.role.displayName"
                  class="role-icon"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="legend-section">
        <h3 class="legend-title">Roles de Agentes</h3>
        <div class="role-legend">
          <div v-for="role in uniqueRoles" :key="role.uuid" class="role-item">
            <img :src="role.displayIcon" :alt="role.displayName" class="role-legend-icon" />
            <span class="role-legend-name">{{ role.displayName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useValorantAPI } from "../composables/useValorantAPI";
import type { Agent, AgentRole } from "../types";

const { fetchAllAgents, isLoading, error } = useValorantAPI();

// Estado de los agentes
const agents = ref<Agent[]>([]);

// Clasificación tier (basada en meta actual de Valorant)
const tierClassification = {
  S: ["Jett", "Raze", "Omen", "Killjoy", "Sage"], // Meta picks
  A: ["Reyna", "Phoenix", "Brimstone", "Cypher", "Sova", "Breach"], // Fuerte
  B: ["Viper", "Yoru", "Skye", "Astra", "Chamber", "KAY/O"], // Viable
  C: ["Neon", "Fade", "Harbor", "Gekko", "Deadlock", "Iso", "Clove", "Vyse"], // Situacional
};

// Computed properties para cada tier
const tierS = computed(() =>
  agents.value.filter((agent) => tierClassification.S.includes(agent.displayName))
);

const tierA = computed(() =>
  agents.value.filter((agent) => tierClassification.A.includes(agent.displayName))
);

const tierB = computed(() =>
  agents.value.filter((agent) => tierClassification.B.includes(agent.displayName))
);

const tierC = computed(() =>
  agents.value.filter((agent) => tierClassification.C.includes(agent.displayName))
);

// Roles únicos para la leyenda
const uniqueRoles = computed(() => {
  const roles = new Map<string, AgentRole>();
  agents.value.forEach((agent) => {
    if (!roles.has(agent.role.uuid)) {
      roles.set(agent.role.uuid, agent.role);
    }
  });
  return Array.from(roles.values());
});

// Función para cargar agentes
const loadAgents = async () => {
  try {
    error.value = null;
    agents.value = await fetchAllAgents();
  } catch (err) {
    error.value = "No se pudieron cargar los agentes. Verifica tu conexión a internet.";
    console.error("Error loading agents:", err);
  }
};

// Cargar agentes al montar el componente
onMounted(() => {
  loadAgents();
});
</script>

<style scoped>
.agents-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e13 0%, #1a1f2e 100%);
  padding: 100px 2rem 2rem;
}

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 4rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title-accent {
  color: #ff4655;
  font-size: 0.7em;
  letter-spacing: 0.3em;
}

.title-main {
  color: #ffffff;
  letter-spacing: 0.1em;
}

.hero-description {
  font-size: 1.2rem;
  color: #a0a0a0;
  line-height: 1.6;
}

/* Loading and Error States */
.loading-section,
.error-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #333;
  border-top: 3px solid #ff4655;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #a0a0a0;
  font-size: 1.1rem;
}

.error-content {
  background: rgba(255, 70, 85, 0.1);
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
}

.error-title {
  color: #ff4655;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.error-message {
  color: #a0a0a0;
  margin-bottom: 1.5rem;
}

.retry-button {
  background: #ff4655;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.retry-button:hover {
  background: #e63946;
}

/* Tier List Section */
.tier-list-section {
  max-width: 1400px;
  margin: 0 auto;
}

.tier-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 4rem;
}

.tier-row {
  display: flex;
  align-items: stretch;
  background: rgba(26, 31, 46, 0.6);
  border-radius: 12px;
  overflow: hidden;
  border-left: 4px solid;
}

.tier-s {
  border-left-color: #ff6b6b;
}
.tier-a {
  border-left-color: #4ecdc4;
}
.tier-b {
  border-left-color: #45b7d1;
}
.tier-c {
  border-left-color: #96ceb4;
}

.tier-label {
  background: rgba(0, 0, 0, 0.4);
  padding: 1.5rem;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.tier-letter {
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
}

.tier-name {
  font-size: 0.9rem;
  color: #a0a0a0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.5rem;
}

.tier-agents {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem;
  align-items: center;
}

.agent-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  min-width: 100px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.agent-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.agent-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.agent-name {
  font-size: 0.8rem;
  color: #ffffff;
  text-align: center;
  font-weight: 600;
}

.role-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(26, 31, 46, 0.9);
}

.role-duelist {
  background: #ff4655;
}
.role-initiator {
  background: #4ecdc4;
}
.role-controller {
  background: #45b7d1;
}
.role-sentinel {
  background: #96ceb4;
}

.role-icon {
  width: 12px;
  height: 12px;
  filter: brightness(0) invert(1);
}

/* Legend Section */
.legend-section {
  background: rgba(26, 31, 46, 0.6);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.legend-title {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.role-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.role-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.role-legend-icon {
  width: 20px;
  height: 20px;
}

.role-legend-name {
  color: #ffffff;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }

  .tier-row {
    flex-direction: column;
  }

  .tier-label {
    min-width: auto;
    padding: 1rem;
  }

  .tier-letter {
    font-size: 2rem;
  }

  .role-legend {
    gap: 1rem;
  }

  .role-item {
    flex-direction: column;
    text-align: center;
    gap: 0.25rem;
  }
}
</style>
