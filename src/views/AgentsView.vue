<template>
  <div class="agents-view">
    <!-- Header minimalista -->
    <header class="header">
      <h1 class="title">Agentes</h1>
      <div v-if="lastUpdate" class="update-info">
        <span class="update-time">Actualizado: {{ formatDate(lastUpdate) }}</span>
      </div>
    </header>

    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="error-state">
      <p>❌ {{ error }}</p>
      <button @click="loadStats" class="retry-btn">Reintentar</button>
    </div>

    <!-- Contenido principal -->
    <main v-else class="main-content">
      <!-- Controles -->
      <div class="controls">
        <div class="search-box">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar agente..."
            class="search-input"
          />
        </div>

        <div class="sort-controls">
          <select v-model="sortBy" @change="sortAgents" class="sort-select">
            <option value="pickRate">Pick Rate</option>
            <option value="winRate">Win Rate</option>
            <option value="name">Nombre</option>
          </select>
        </div>
      </div>

      <!-- Grid de agentes -->
      <div class="agents-grid">
        <div
          v-for="(agent, index) in filteredAgents"
          :key="agent.agentName"
          class="agent-card"
          :class="{ 'top-pick': index < 3 }"
        >
          <!-- Imagen del agente -->
          <div class="agent-image-container">
            <img
              :src="getAgentImage(agent.agentName)"
              :alt="cleanAgentName(agent.agentName)"
              class="agent-image"
            />
            <div class="agent-role-badge">{{ extractRole(agent.agentName) }}</div>
          </div>

          <div class="agent-content">
            <div class="agent-header">
              <h3 class="agent-name">{{ cleanAgentName(agent.agentName) }}</h3>
            </div>

            <div class="stats-container">
              <div class="stat">
                <span class="stat-label">Pick</span>
                <span class="stat-value">{{ agent.pickRate }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Win</span>
                <span class="stat-value">{{ agent.winRate }}</span>
              </div>
              <div v-if="agent.avgKDA" class="stat">
                <span class="stat-label">KDA</span>
                <span class="stat-value">{{ agent.avgKDA }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { OpggAgentStats } from "../types";
import { OpggService } from "../services/opggService";

// Estado reactivo
const agents = ref<OpggAgentStats[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const lastUpdate = ref<Date | null>(null);
const currentWeek = ref<string>("");

// Controles
const sortBy = ref<"pickRate" | "winRate" | "name">("pickRate");
const searchTerm = ref("");

// Computadas
const filteredAgents = computed(() => {
  let filtered = agents.value;

  // Filtrar por búsqueda
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(
      (agent) =>
        cleanAgentName(agent.agentName).toLowerCase().includes(term) ||
        extractRole(agent.agentName).toLowerCase().includes(term)
    );
  }

  return filtered;
});

// Métodos
async function loadStats() {
  try {
    loading.value = true;
    error.value = null;

    const opggService = new OpggService();
    const data = await opggService.getLatestData();

    if (data) {
      agents.value = data.agents;
      lastUpdate.value = data.scrapedAt;
      currentWeek.value = data.week;
      sortAgents();
    } else {
      error.value = "No se encontraron datos";
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Error cargando datos";
  } finally {
    loading.value = false;
  }
}

function sortAgents() {
  const sorted = [...agents.value];

  switch (sortBy.value) {
    case "pickRate":
      sorted.sort((a, b) => {
        const aRate = parseFloat(a.pickRate.replace("%", "") || "0");
        const bRate = parseFloat(b.pickRate.replace("%", "") || "0");
        return bRate - aRate;
      });
      break;
    case "winRate":
      sorted.sort((a, b) => {
        const aRate = parseFloat(a.winRate.replace("%", "") || "0");
        const bRate = parseFloat(b.winRate.replace("%", "") || "0");
        return bRate - aRate;
      });
      break;
    case "name":
      sorted.sort((a, b) => cleanAgentName(a.agentName).localeCompare(cleanAgentName(b.agentName)));
      break;
  }

  agents.value = sorted;
}

function cleanAgentName(name: string): string {
  return name.replace(/(Duelist|Controller|Initiator|Sentinel)$/, "");
}

function extractRole(name: string): string {
  const match = name.match(/(Duelist|Controller|Initiator|Sentinel)$/);
  return match ? match[1] : "Agent";
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAgentImage(agentName: string): string {
  // Buscar el agente por nombre para obtener su icono
  const agent = agents.value.find((a) => a.agentName === agentName);

  // Si encontramos el agente y tiene icono, lo usamos
  if (agent && agent.agentIcon) {
    return agent.agentIcon;
  }

  // Si no, usamos un placeholder
  const name = cleanAgentName(agentName).toLowerCase().trim();
  return "https://placehold.co/200x200?text=" + name;
}

// Lifecycle
onMounted(() => {
  loadStats();
});
</script>

<style scoped>
.agents-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  color: #fff;
  font-family: "Inter", system-ui, sans-serif;
}

.header {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #ff4655, #0f1923);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.update-info {
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
}

.update-time {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #ff4655;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  background: #ff4655;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #e63e4c;
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.search-input,
.sort-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-input:focus,
.sort-select:focus {
  outline: none;
  border-color: #ff4655;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.agent-card {
  background: rgba(15, 25, 35, 0.7);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.agent-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  background: rgba(20, 30, 40, 0.8);
}

.agent-card.top-pick {
  border-left: 3px solid #ff4655;
}

.agent-image-container {
  height: 160px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.agent-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.agent-card:hover .agent-image {
  transform: scale(1.05);
}

.agent-role-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 70, 85, 0.8);
  color: white;
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.agent-content {
  padding: 0.8rem;
}

.agent-header {
  margin-bottom: 0.8rem;
}

.agent-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stats-container {
  display: flex;
  justify-content: space-between;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.2rem;
}

.stat-value {
  font-size: 0.9rem;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .main-content {
    padding: 1rem;
  }

  .agents-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>
