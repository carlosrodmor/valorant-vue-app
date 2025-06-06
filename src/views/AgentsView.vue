<template>
  <div class="agents-view">
    <!-- Fondo animado -->
    <div class="background-effects">
      <div class="floating-particles"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Header elegante -->
    <header class="header">
      <div class="header-glow"></div>
      <h1 class="title">
        <span class="title-text">AGENTES</span>
        <span class="title-subtitle">VALORANT STATS</span>
      </h1>
      <div v-if="lastUpdate" class="update-info">
        <span class="update-time">{{ formatDate(lastUpdate) }}</span>
      </div>
    </header>

    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-text">CARGANDO</div>
      </div>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠</div>
      <p class="error-message">{{ error }}</p>
      <button @click="loadStats" class="retry-btn">
        <span class="btn-text">REINTENTAR</span>
        <span class="btn-glow"></span>
      </button>
    </div>

    <!-- Contenido principal -->
    <main v-else class="main-content">
      <!-- Controles mejorados -->
      <div class="controls">
        <div class="search-container">
          <div class="search-icon">🔍</div>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar agente..."
            class="search-input"
          />
          <div class="search-glow"></div>
        </div>

        <div class="sort-container">
          <select v-model="sortBy" @change="sortAgents" class="sort-select">
            <option value="pickRate">Pick Rate</option>
            <option value="winRate">Win Rate</option>
            <option value="name">Nombre</option>
          </select>
          <div class="select-glow"></div>
        </div>
      </div>

      <!-- Grid de agentes mejorado -->
      <div class="agents-grid">
        <div
          v-for="(agent, index) in filteredAgents"
          :key="agent.agentName"
          class="agent-card"
          :class="{ 'top-agent': index < 3 }"
          :style="{ '--card-delay': index * 0.1 + 's' }"
        >
          <div class="card-glow"></div>
          <div class="card-border"></div>

          <div class="card-content">
            <!-- Avatar mejorado -->
            <div class="agent-avatar">
              <div class="avatar-ring"></div>
              <div class="avatar-glow"></div>
              <img
                :src="getAgentImage(agent.agentName)"
                :alt="cleanAgentName(agent.agentName)"
                class="agent-image"
              />
              <div class="rank-badge" v-if="index < 3">#{{ index + 1 }}</div>
            </div>

            <!-- Información del agente -->
            <div class="agent-info">
              <div class="agent-header">
                <h3 class="agent-name">{{ cleanAgentName(agent.agentName) }}</h3>
                <span class="agent-role" :class="getRoleClass(agent.agentName)">
                  {{ extractRole(agent.agentName) }}
                </span>
              </div>

              <div class="stats-container">
                <div class="stat-item pick-stat">
                  <div class="stat-icon">🎯</div>
                  <div class="stat-content">
                    <span class="stat-label">PICK</span>
                    <span class="stat-value">{{ agent.pickRate }}</span>
                  </div>
                  <div class="stat-bar">
                    <div class="stat-fill" :style="{ width: agent.pickRate }"></div>
                  </div>
                </div>

                <div class="stat-item win-stat">
                  <div class="stat-icon">🏆</div>
                  <div class="stat-content">
                    <span class="stat-label">WIN</span>
                    <span class="stat-value">{{ agent.winRate }}</span>
                  </div>
                  <div class="stat-bar">
                    <div class="stat-fill" :style="{ width: agent.winRate }"></div>
                  </div>
                </div>

                <div v-if="agent.avgKDA" class="stat-item kda-stat">
                  <div class="stat-icon">⚔️</div>
                  <div class="stat-content">
                    <span class="stat-label">KDA</span>
                    <span class="stat-value">{{ agent.avgKDA }}</span>
                  </div>
                </div>
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

function getRoleClass(agentName: string): string {
  const role = extractRole(agentName).toLowerCase();
  return `role-${role}`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleString("es-ES", {
    day: "numeric",
    month: "short",
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
  return "https://placehold.co/100x100?text=" + name;
}

// Lifecycle
onMounted(() => {
  loadStats();
});
</script>

<style scoped>
.agents-view {
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #1a2332 0%, #0f1419 70%);
  color: #eaeaea;
  font-family: "Inter", "Rajdhani", system-ui, sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* Efectos de fondo */
.background-effects {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.floating-particles::before {
  content: "";
  position: absolute;
  width: 2px;
  height: 2px;
  background: #ff4655;
  border-radius: 50%;
  box-shadow: 0 0 6px #ff4655, 20px 30px 0 0 #4ecdc4, 40px 70px 0 0 #ff4655, 90px 40px 0 0 #ffd700,
    130px 80px 0 0 #4ecdc4, 160px 30px 0 0 #ff4655;
  animation: float 20s infinite linear;
}

.grid-overlay {
  background: linear-gradient(90deg, rgba(255, 70, 85, 0.03) 1px, transparent 1px),
    linear-gradient(rgba(255, 70, 85, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
  width: 100%;
  height: 100%;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
  }
}

/* Header mejorado */
.header {
  text-align: center;
  padding: 2rem 0 3rem;
  position: relative;
  z-index: 2;
}

.header-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 70, 85, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.title {
  position: relative;
  z-index: 3;
}

.title-text {
  display: block;
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: 4px;
  background: linear-gradient(45deg, #ff4655, #ff8a65, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255, 70, 85, 0.5);
  margin-bottom: 0.25rem;
  animation: glow 2s ease-in-out infinite alternate;
}

.title-subtitle {
  display: block;
  font-size: 0.9rem;
  font-weight: 300;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

@keyframes glow {
  from {
    text-shadow: 0 0 20px rgba(255, 70, 85, 0.5);
  }
  to {
    text-shadow: 0 0 30px rgba(255, 70, 85, 0.8), 0 0 40px rgba(255, 140, 101, 0.4);
  }
}

.update-info {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 300;
}

/* Estados de carga y error mejorados */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  position: relative;
  z-index: 2;
}

.loading-spinner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner-ring {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #ff4655;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  position: relative;
}

.spinner-ring::after {
  content: "";
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border: 1px solid rgba(255, 70, 85, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.spinner-text {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: #ff4655;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  gap: 1rem;
  position: relative;
  z-index: 2;
}

.error-icon {
  font-size: 3rem;
  color: #ff4655;
  animation: shake 0.5s ease-in-out infinite alternate;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(10px);
  }
}

.error-message {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.retry-btn {
  position: relative;
  background: transparent;
  border: 2px solid #ff4655;
  color: #ff4655;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 1px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 70, 85, 0.3);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 70, 85, 0.8), transparent);
  transition: left 0.5s;
}

.retry-btn:hover .btn-glow {
  left: 100%;
}

/* Contenido principal */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
  position: relative;
  z-index: 2;
}

/* Controles mejorados */
.controls {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  justify-content: center;
  flex-wrap: wrap;
}

.search-container,
.sort-container {
  position: relative;
}

.search-container {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.search-container:focus-within {
  border-color: #ff4655;
  box-shadow: 0 0 20px rgba(255, 70, 85, 0.3);
}

.search-icon {
  margin-right: 0.5rem;
  color: rgba(255, 255, 255, 0.5);
}

.search-input {
  background: transparent;
  border: none;
  color: white;
  outline: none;
  font-size: 0.9rem;
  width: 200px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.sort-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.sort-select {
  background: transparent;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
}

/* Grid de agentes mejorado */
.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.agent-card {
  position: relative;
  background: rgba(30, 40, 60, 0.4);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: cardAppear 0.6s ease-out var(--card-delay) both;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.agent-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 70, 85, 0.2);
}

.agent-card.top-agent {
  background: rgba(255, 70, 85, 0.1);
  border: 1px solid rgba(255, 70, 85, 0.3);
}

.card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #ff4655, #4ecdc4, #ffd700, #ff4655);
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
  animation: rotateGlow 4s linear infinite;
}

.agent-card:hover .card-glow {
  opacity: 0.3;
}

@keyframes rotateGlow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.card-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff4655, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.agent-card:hover .card-border {
  opacity: 1;
}

.card-content {
  padding: 1.5rem;
  position: relative;
  z-index: 2;
}

/* Avatar mejorado */
.agent-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
}

.avatar-ring {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 2px solid rgba(255, 70, 85, 0.5);
  border-radius: 50%;
  animation: rotateRing 3s linear infinite;
}

@keyframes rotateRing {
  0% {
    transform: rotate(0deg);
    border-color: rgba(255, 70, 85, 0.5);
  }
  33% {
    border-color: rgba(78, 205, 196, 0.5);
  }
  66% {
    border-color: rgba(255, 215, 0, 0.5);
  }
  100% {
    transform: rotate(360deg);
    border-color: rgba(255, 70, 85, 0.5);
  }
}

.avatar-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(255, 70, 85, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.agent-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  z-index: 2;
  border: 3px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.agent-card:hover .agent-image {
  border-color: #ff4655;
  box-shadow: 0 0 20px rgba(255, 70, 85, 0.5);
}

.rank-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(45deg, #ff4655, #ff8a65);
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  border: 2px solid rgba(255, 255, 255, 0.2);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Información del agente */
.agent-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.agent-name {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.agent-role {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.role-duelist {
  background: linear-gradient(45deg, #ff4655, #ff8a65);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 70, 85, 0.3);
}

.role-controller {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
}

.role-initiator {
  background: linear-gradient(45deg, #ffd700, #ffb347);
  color: #333;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.role-sentinel {
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
  color: white;
  box-shadow: 0 4px 15px rgba(155, 89, 182, 0.3);
}

/* Estadísticas mejoradas */
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.stat-icon {
  font-size: 1.2rem;
  width: 30px;
  text-align: center;
}

.stat-content {
  flex-grow: 1;
}

.stat-label {
  display: block;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.2rem;
}

.stat-value {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

.stat-bar {
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff4655, #ff8a65);
  border-radius: 2px;
  transition: width 1s ease-out;
  animation: fillBar 2s ease-out;
}

@keyframes fillBar {
  from {
    width: 0%;
  }
}

.pick-stat .stat-fill {
  background: linear-gradient(90deg, #ff4655, #ff8a65);
}

.win-stat .stat-fill {
  background: linear-gradient(90deg, #4ecdc4, #44a08d);
}

/* Responsive */
@media (max-width: 768px) {
  .title-text {
    font-size: 2rem;
  }

  .agents-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .controls {
    gap: 1rem;
    flex-direction: column;
    align-items: center;
  }

  .search-input {
    width: 150px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 0 0.5rem 2rem;
  }

  .card-content {
    padding: 1rem;
  }

  .agent-avatar {
    width: 60px;
    height: 60px;
  }

  .agent-image {
    width: 60px;
    height: 60px;
  }

  .stats-container {
    gap: 0.5rem;
  }

  .stat-item {
    padding: 0.5rem;
  }
}
</style>
