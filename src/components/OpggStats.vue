<template>
  <div class="opgg-stats">
    <div class="stats-header">
      <h2>📊 Estadísticas de Valorant - OP.GG</h2>
      <div class="stats-info">
        <span v-if="lastUpdate">Última actualización: {{ formatDate(lastUpdate) }}</span>
        <span v-if="currentWeek">Semana: {{ currentWeek }}</span>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando estadísticas...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>❌ Error cargando datos: {{ error }}</p>
    </div>

    <div v-else-if="agents.length > 0" class="stats-content">
      <!-- Filtros -->
      <div class="filters">
        <div class="filter-group">
          <label>Ordenar por:</label>
          <select v-model="sortBy" @change="sortAgents">
            <option value="pickRate">Pick Rate</option>
            <option value="winRate">Win Rate</option>
            <option value="name">Nombre</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Buscar agente:</label>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por nombre..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Estadísticas resumidas -->
      <div class="summary-stats">
        <div class="stat-card">
          <h3>{{ filteredAgents.length }}</h3>
          <p>Agentes totales</p>
        </div>
        <div class="stat-card">
          <h3>{{ averagePickRate.toFixed(1) }}%</h3>
          <p>Pick Rate promedio</p>
        </div>
        <div class="stat-card">
          <h3>{{ averageWinRate.toFixed(1) }}%</h3>
          <p>Win Rate promedio</p>
        </div>
        <div class="stat-card">
          <h3>{{ topAgent?.agentName || "N/A" }}</h3>
          <p>Agente más popular</p>
        </div>
      </div>

      <!-- Tabla de agentes -->
      <div class="agents-table">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Agente</th>
              <th>Pick Rate</th>
              <th>Win Rate</th>
              <th>KDA</th>
              <th>Puntuación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(agent, index) in filteredAgents" :key="agent.agentName" class="agent-row">
              <td>{{ index + 1 }}</td>
              <td class="agent-cell">
                <img
                  v-if="agent.agentIcon"
                  :src="agent.agentIcon"
                  :alt="agent.agentName"
                  class="agent-icon"
                  @error="handleImageError"
                />
                <span class="agent-name">{{ cleanAgentName(agent.agentName) }}</span>
                <span class="agent-tier">{{ agent.tier }}</span>
              </td>
              <td class="pick-rate">
                <div class="rate-bar">
                  <div class="rate-fill pick-rate-fill" :style="{ width: agent.pickRate }"></div>
                  <span>{{ agent.pickRate }}</span>
                </div>
              </td>
              <td class="win-rate">
                <div class="rate-bar">
                  <div class="rate-fill win-rate-fill" :style="{ width: agent.winRate }"></div>
                  <span>{{ agent.winRate }}</span>
                </div>
              </td>
              <td>{{ agent.avgKDA }}</td>
              <td>{{ agent.avgScore }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="no-data">
      <p>📭 No hay datos disponibles</p>
    </div>
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

// Filtros
const sortBy = ref<"pickRate" | "winRate" | "name">("pickRate");
const searchTerm = ref("");

// Computadas
const filteredAgents = computed(() => {
  let filtered = agents.value;

  // Filtrar por término de búsqueda
  if (searchTerm.value) {
    filtered = filtered.filter((agent) =>
      cleanAgentName(agent.agentName).toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }

  return filtered;
});

const averagePickRate = computed(() => {
  if (filteredAgents.value.length === 0) return 0;
  const total = filteredAgents.value.reduce(
    (sum, agent) => sum + OpggService.parsePickRate(agent.pickRate),
    0
  );
  return total / filteredAgents.value.length;
});

const averageWinRate = computed(() => {
  if (filteredAgents.value.length === 0) return 0;
  const total = filteredAgents.value.reduce(
    (sum, agent) => sum + OpggService.parseWinRate(agent.winRate),
    0
  );
  return total / filteredAgents.value.length;
});

const topAgent = computed(() => {
  return OpggService.getTopAgentsByPickRate(filteredAgents.value, 1)[0];
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
    error.value = err instanceof Error ? err.message : "Error desconocido";
  } finally {
    loading.value = false;
  }
}

function sortAgents() {
  switch (sortBy.value) {
    case "pickRate":
      agents.value = OpggService.sortByPickRate(agents.value);
      break;
    case "winRate":
      agents.value = OpggService.sortByWinRate(agents.value);
      break;
    case "name":
      agents.value.sort((a, b) =>
        cleanAgentName(a.agentName).localeCompare(cleanAgentName(b.agentName))
      );
      break;
  }
}

function cleanAgentName(name: string): string {
  // Limpiar nombres como "JettDuelist" -> "Jett"
  return name.replace(/(Duelist|Controller|Initiator|Sentinel)$/, "");
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.style.display = "none";
}

// Lifecycle
onMounted(() => {
  loadStats();
});
</script>

<style scoped>
.opgg-stats {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.stats-header {
  text-align: center;
  margin-bottom: 30px;
}

.stats-header h2 {
  color: #ff6b47;
  font-size: 2rem;
  margin-bottom: 10px;
}

.stats-info {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 0.9rem;
  color: #666;
}

.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff6b47;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  background: #ffe6e6;
  color: #d00;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-weight: 600;
  color: #333;
}

.filter-group select,
.search-input {
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.filter-group select:focus,
.search-input:focus {
  outline: none;
  border-color: #ff6b47;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-card h3 {
  font-size: 2rem;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.stat-card p {
  margin: 0;
  opacity: 0.9;
}

.agents-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

th {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.agent-row:hover {
  background: #f8f9fa;
}

.agent-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.agent-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.agent-name {
  font-weight: 600;
  color: #333;
}

.agent-tier {
  font-size: 0.8rem;
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 4px;
  color: #6c757d;
}

.rate-bar {
  position: relative;
  background: #e9ecef;
  border-radius: 4px;
  height: 20px;
  overflow: hidden;
  min-width: 80px;
}

.rate-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 4px;
}

.pick-rate-fill {
  background: linear-gradient(90deg, #28a745, #20c997);
}

.win-rate-fill {
  background: linear-gradient(90deg, #007bff, #6610f2);
}

.rate-bar span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: #333;
  z-index: 1;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* Responsive */
@media (max-width: 768px) {
  .opgg-stats {
    padding: 10px;
  }

  .filters {
    flex-direction: column;
  }

  .agents-table {
    overflow-x: auto;
  }

  table {
    min-width: 600px;
  }
}
</style>
