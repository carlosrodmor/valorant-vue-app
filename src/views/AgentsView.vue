<template>
  <div class="agents-view">
    <!-- Fondo animado similar a HomeView -->
    <div class="background-container">
      <div class="background-wrapper">
        <div class="background-image"></div>
        <div class="background-overlay"></div>
        <div class="background-gradient"></div>
      </div>
      <div class="particles-container">
        <div v-for="i in 6" :key="`particle-${i}`" :class="`particle particle-${i}`"></div>
      </div>
      <div class="geometric-elements">
        <div v-for="i in 3" :key="`geo-${i}`" :class="`geo-element geo-${i}`"></div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="content-wrapper">
      <!-- Header estilo HomeView -->
      <header class="header">
        <div class="brand-icon">
          <div class="icon-core"></div>
          <div class="icon-rings">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
          </div>
        </div>
        <h1 class="brand-title">
          <span class="title-text">AGENTES</span>
          <div class="title-glow"></div>
        </h1>
        <p class="brand-tagline">
          <span class="tagline-text">Estadísticas y Meta de VALORANT</span>
        </p>
        <div v-if="lastUpdate" class="update-info">
          <span class="update-time">{{ formatDate(lastUpdate) }}</span>
        </div>
      </header>

      <!-- Estado de carga -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-text">CARGANDO AGENTES</div>
        </div>
      </div>

      <!-- Estado de error -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠</div>
        <p class="error-message">{{ error }}</p>
        <button @click="loadStats" class="retry-btn">
          <span class="btn-text">REINTENTAR</span>
        </button>
      </div>

      <!-- Contenido principal -->
      <main v-else class="main-content">
        <!-- Controles minimalistas -->
        <div class="controls-container">
          <!-- Búsqueda -->
          <div class="search-container">
            <div class="search-icon">🔍</div>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar agente..."
              class="search-input"
            />
            <div v-if="searchTerm" @click="searchTerm = ''" class="clear-btn">×</div>
          </div>

          <!-- Filtros de rol simples -->
          <div class="role-filters">
            <button
              v-for="role in availableRoles"
              :key="role.name"
              @click="toggleRoleFilter(role.name)"
              :class="[
                'role-btn',
                `role-${role.name.toLowerCase()}`,
                { active: activeRoleFilters.includes(role.name) },
              ]"
            >
              <span class="role-icon">{{ role.icon }}</span>
              <span class="role-name">{{ role.name }}</span>
            </button>
          </div>

          <!-- Ordenamiento elegante -->
          <div class="sort-container">
            <div class="sort-dropdown" :class="{ open: showSortDropdown }">
              <button @click="showSortDropdown = !showSortDropdown" class="sort-button">
                <span class="sort-text">{{ getSortLabel(sortBy) }}</span>
                <span class="sort-arrow">▼</span>
              </button>
              <div v-if="showSortDropdown" class="sort-options">
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="selectSort(option.value)"
                  :class="['sort-option', { active: sortBy === option.value }]"
                >
                  <span class="option-icon">{{ option.icon }}</span>
                  <span class="option-text">{{ option.label }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Stats rápidas -->
          <div class="quick-stats">
            <div class="stat-box">
              <div class="stat-number">{{ filteredAgents.length }}</div>
              <div class="stat-label">Agentes</div>
            </div>
          </div>
        </div>

        <!-- Grid de agentes -->
        <div class="agents-grid">
          <div
            v-for="(agent, index) in filteredAgents"
            :key="agent.agentName"
            class="agent-card"
            :class="{ 'top-agent': index < 3 }"
          >
            <!-- Avatar del agente -->
            <div class="agent-avatar">
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
              <h3 class="agent-name">{{ cleanAgentName(agent.agentName) }}</h3>
              <span class="agent-role" :class="getRoleClass(agent.agentName)">
                {{ extractRole(agent.agentName) }}
              </span>

              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-label">PICK</div>
                  <div class="stat-value">{{ agent.pickRate }}</div>
                  <div class="stat-bar">
                    <div class="stat-fill pick-fill" :style="{ width: agent.pickRate }"></div>
                  </div>
                </div>

                <div class="stat-item">
                  <div class="stat-label">WIN</div>
                  <div class="stat-value">{{ agent.winRate }}</div>
                  <div class="stat-bar">
                    <div class="stat-fill win-fill" :style="{ width: agent.winRate }"></div>
                  </div>
                </div>

                <div v-if="agent.avgKDA" class="stat-item">
                  <div class="stat-label">KDA</div>
                  <div class="stat-value">{{ formatKDA(agent.avgKDA) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
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
const activeRoleFilters = ref<string[]>([]);
const showSortDropdown = ref(false);

// Datos para filtros avanzados
const availableRoles = ref([
  { name: "Duelist", icon: "⚔️" },
  { name: "Controller", icon: "🛡️" },
  { name: "Initiator", icon: "⚡" },
  { name: "Sentinel", icon: "🔒" },
]);

const sortOptions = ref([
  { value: "pickRate", label: "Pick Rate", icon: "🎯" },
  { value: "winRate", label: "Win Rate", icon: "🏆" },
  { value: "name", label: "Nombre", icon: "📝" },
]);

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

  // Filtrar por roles
  if (activeRoleFilters.value.length > 0) {
    filtered = filtered.filter((agent) =>
      activeRoleFilters.value.includes(extractRole(agent.agentName))
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

// Función para simplificar el formato de KDA
function formatKDA(kda: string): string {
  if (!kda) return "";

  // Si contiene formato complejo como "1.29:1(16.70 / 15.63 / 3.46)"
  // Extraer solo el primer número que es el KDA ratio
  const match = kda.match(/^(\d+\.?\d*)/);
  if (match) {
    const ratio = parseFloat(match[1]);
    return ratio.toFixed(2);
  }

  // Si ya es un número simple, mantenerlo
  return kda;
}

// Métodos nuevos para filtros
function toggleRoleFilter(role: string) {
  const index = activeRoleFilters.value.indexOf(role);
  if (index > -1) {
    activeRoleFilters.value.splice(index, 1);
  } else {
    activeRoleFilters.value.push(role);
  }
}

// Funciones para el dropdown de ordenamiento
function getSortLabel(sortValue: string): string {
  const option = sortOptions.value.find((opt) => opt.value === sortValue);
  return option ? option.label : "Ordenar";
}

function selectSort(value: "pickRate" | "winRate" | "name") {
  sortBy.value = value;
  showSortDropdown.value = false;
  sortAgents();
}

// Event listener para cerrar dropdown
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  if (!target.closest(".sort-dropdown")) {
    showSortDropdown.value = false;
  }
}

// Lifecycle
onMounted(() => {
  loadStats();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.agents-view {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  animation: pageEnter 2s ease-out;
  font-family: var(--font-family);
  color: var(--color-white);
}

/* Fondo animado similar a HomeView */
.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.background-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%;
  z-index: 1;
}

.background-image {
  width: 100%;
  height: 100%;
  background: url("https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")
    center/cover no-repeat;
  filter: brightness(0.2) contrast(1.3) saturate(1.2);
  transform-origin: center;
  animation: subtleZoom 25s ease-in-out infinite alternate;
}

@keyframes subtleZoom {
  from {
    transform: scale(1);
    filter: brightness(0.2) contrast(1.3) saturate(1.2);
  }
  to {
    transform: scale(1.08);
    filter: brightness(0.25) contrast(1.2) saturate(1.1);
  }
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 25% 25%, var(--color-accent-20) 0%, transparent 45%),
    radial-gradient(circle at 75% 75%, var(--color-accent-10) 0%, transparent 45%),
    radial-gradient(circle at 50% 50%, var(--color-primary-dark) 0%, transparent 70%),
    linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-secondary-dark) 100%);
}

.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 3, 14, 0.1) 0%,
    rgba(0, 3, 14, 0.6) 40%,
    rgba(0, 3, 14, 0.9) 100%
  );
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--color-accent);
  border-radius: 50%;
  opacity: 0;
  animation: floatUp linear infinite;
}

.particle-1 {
  left: 10%;
  animation-delay: 0s;
  animation-duration: 8s;
}
.particle-2 {
  left: 20%;
  animation-delay: 1s;
  animation-duration: 7s;
}
.particle-3 {
  left: 40%;
  animation-delay: 2s;
  animation-duration: 9s;
}
.particle-4 {
  left: 60%;
  animation-delay: 3s;
  animation-duration: 6s;
}
.particle-5 {
  left: 80%;
  animation-delay: 4s;
  animation-duration: 8s;
}
.particle-6 {
  left: 90%;
  animation-delay: 5s;
  animation-duration: 7s;
}

@keyframes floatUp {
  0% {
    opacity: 0;
    transform: translateY(100vh) scale(0) rotate(0deg);
  }
  10% {
    opacity: 0.6;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
    transform: translateY(-10vh) scale(1.2) rotate(180deg);
  }
}

.geometric-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
}

.geo-element {
  position: absolute;
  border: 1px solid var(--color-accent-20);
  animation: rotate 40s linear infinite;
}

.geo-1 {
  width: 150px;
  height: 150px;
  top: 20%;
  right: 10%;
  border-radius: 50%;
  animation-direction: normal;
  opacity: 0.3;
}

.geo-2 {
  width: 80px;
  height: 80px;
  bottom: 25%;
  left: 15%;
  transform: rotate(45deg);
  animation-direction: reverse;
  animation-duration: 30s;
  opacity: 0.4;
}

.geo-3 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 30%;
  border-radius: 25%;
  animation-duration: 50s;
  opacity: 0.25;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pageEnter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Contenido principal */
.content-wrapper {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  width: 100%;
}

/* Header estilo HomeView */
.header {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  padding: 2rem 0;
}

.brand-icon {
  position: relative;
  width: 70px;
  height: 70px;
  margin-bottom: 1.5rem;
}

.icon-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  background: linear-gradient(45deg, var(--color-accent), var(--color-white));
  border-radius: 50%;
  box-shadow: 0 0 20px var(--color-accent-80), 0 0 40px var(--color-accent-50),
    0 0 60px var(--color-accent-20);
  animation: corePulse 3s ease-in-out infinite;
}

.icon-rings {
  position: relative;
  width: 100%;
  height: 100%;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid var(--color-accent-50);
  border-radius: 50%;
  animation: expandRing 6s ease-in-out infinite;
}

.ring-1 {
  width: 35px;
  height: 35px;
  margin: -17.5px 0 0 -17.5px;
  animation-delay: 0s;
}

.ring-2 {
  width: 55px;
  height: 55px;
  margin: -27.5px 0 0 -27.5px;
  animation-delay: 3s;
}

@keyframes corePulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 20px var(--color-accent-80), 0 0 40px var(--color-accent-50),
      0 0 60px var(--color-accent-20);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    box-shadow: 0 0 30px var(--color-accent), 0 0 60px var(--color-accent-60),
      0 0 90px var(--color-accent-30);
  }
}

@keyframes expandRing {
  0% {
    transform: scale(0.6);
    opacity: 0;
    border-width: 2px;
  }
  50% {
    opacity: 1;
    border-width: 1px;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
    border-width: 0px;
  }
}

.brand-title {
  position: relative;
  margin: 0;
}

.title-text {
  font-family: var(--font-family);
  font-size: 3.5rem;
  font-weight: 900;
  color: var(--color-white);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 2;
  background: linear-gradient(45deg, var(--color-white), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleShine 3s ease-in-out infinite;
}

@keyframes titleShine {
  0%,
  100% {
    background: linear-gradient(45deg, var(--color-white), var(--color-accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  50% {
    background: linear-gradient(
      45deg,
      var(--color-accent),
      var(--color-white),
      var(--color-accent)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.title-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, var(--color-accent-20), transparent);
  filter: blur(20px);
  opacity: 0.6;
  z-index: 1;
  animation: glowPulse 4s ease-in-out infinite;
}

@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.brand-tagline {
  margin-top: 1rem;
}

.tagline-text {
  font-family: var(--font-family);
  font-size: 1.1rem;
  font-weight: 300;
  color: var(--color-accent);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  text-shadow: 0 0 15px var(--color-accent-50);
  opacity: 0.9;
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

/* Contenido principal */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
  position: relative;
  z-index: 2;
}

/* Controles minimalistas y elegantes */
.controls-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: var(--color-secondary-60);
  backdrop-filter: var(--blur-glass);
  border-radius: 16px;
  border: 1px solid var(--color-accent-20);
  box-shadow: var(--shadow-accent);
  justify-content: center;
  align-items: center;
}

/* Búsqueda minimalista */
.search-container {
  position: relative;
  min-width: 250px;
  display: flex;
  align-items: center;
  background: var(--color-white-05);
  border-radius: 25px;
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--color-white-10);
  transition: all 0.3s ease;
}

.search-container:focus-within {
  border-color: var(--color-accent);
  background: var(--color-accent-10);
  box-shadow: 0 0 20px var(--color-accent-20);
}

.search-icon {
  margin-right: 0.75rem;
  font-size: 1rem;
  color: var(--color-accent);
}

.search-input {
  background: transparent;
  border: none;
  color: var(--color-white);
  outline: none;
  font-size: 0.95rem;
  flex-grow: 1;
  font-family: var(--font-family);
}

.search-input::placeholder {
  color: var(--color-white-20);
}

.clear-btn {
  margin-left: 0.5rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
  border-radius: 50%;
  background: var(--color-white-10);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.2rem;
  color: var(--color-white-20);
}

.clear-btn:hover {
  background: var(--color-accent);
  color: var(--color-white);
  transform: scale(1.1);
}

/* Filtros de rol elegantes */
.role-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.role-btn {
  background: var(--color-white-05);
  border: 1px solid var(--color-white-10);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-white-90);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-family);
}

.role-btn:hover {
  background: var(--color-white-10);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.role-btn.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-white);
  box-shadow: 0 0 20px var(--color-accent-30);
}

.role-icon {
  font-size: 1rem;
}

.role-name {
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

/* Dropdown de ordenamiento elegante */
.sort-container {
  position: relative;
}

.sort-dropdown {
  position: relative;
  min-width: 160px;
}

.sort-button {
  background: var(--color-white-05);
  border: 1px solid var(--color-white-10);
  border-radius: 20px;
  color: var(--color-white);
  outline: none;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-family);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
}

.sort-button:hover,
.sort-dropdown.open .sort-button {
  border-color: var(--color-accent);
  background: var(--color-accent-10);
  box-shadow: 0 0 15px var(--color-accent-20);
}

.sort-arrow {
  transition: transform 0.3s ease;
  font-size: 0.8rem;
  color: var(--color-accent);
}

.sort-dropdown.open .sort-arrow {
  transform: rotate(180deg);
}

.sort-options {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--color-secondary-60);
  backdrop-filter: var(--blur-glass);
  border: 1px solid var(--color-accent-20);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 100;
  overflow: hidden;
  animation: dropdownSlide 0.3s ease-out;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sort-option {
  background: transparent;
  border: none;
  color: var(--color-white-90);
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  text-align: left;
}

.sort-option:hover {
  background: var(--color-white-10);
  color: var(--color-white);
}

.sort-option.active {
  background: var(--color-accent);
  color: var(--color-white);
}

.option-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.option-text {
  flex-grow: 1;
}

/* Stats rápidas elegantes */
.quick-stats {
  background: var(--color-accent-10);
  border: 1px solid var(--color-accent-20);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  box-shadow: 0 0 20px var(--color-accent-10);
}

.stat-box {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-accent);
  text-shadow: 0 0 10px var(--color-accent-30);
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-white-90);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Grid de agentes elegante */
.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.agent-card {
  position: relative;
  background: var(--color-secondary-60);
  backdrop-filter: var(--blur-glass);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid var(--color-white-10);
  text-align: center;
  animation: fadeInUp 0.6s ease-out both;
  animation-delay: calc(var(--i, 0) * 0.1s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.agent-card:hover {
  transform: translateY(-8px);
  border-color: var(--color-accent);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px var(--color-accent-30);
  background: var(--color-secondary-80);
}

.agent-card.top-agent {
  border-color: var(--color-accent);
  background: var(--color-accent-10);
  box-shadow: 0 0 30px var(--color-accent-20);
}

/* Avatar del agente elegante */
.agent-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
}

.avatar-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, var(--color-accent-20) 0%, transparent 70%);
  border-radius: 50%;
  animation: gentlePulse 3s ease-in-out infinite;
}

@keyframes gentlePulse {
  0%,
  100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.agent-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  z-index: 2;
  border: 3px solid var(--color-white-20);
  transition: all 0.3s ease;
}

.agent-card:hover .agent-image {
  border-color: var(--color-accent);
  box-shadow: 0 0 25px var(--color-accent-50);
  transform: scale(1.05);
}

.rank-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--color-accent);
  color: var(--color-white);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  border: 2px solid var(--color-white);
  box-shadow: 0 0 15px var(--color-accent-30);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* Información del agente elegante */
.agent-info {
  text-align: center;
}

.agent-name {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0 0 0.75rem;
  color: var(--color-white);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-family: var(--font-family);
}

.agent-role {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: var(--color-accent);
  color: var(--color-white);
  box-shadow: 0 0 20px var(--color-accent-30);
  margin-bottom: 1.5rem;
  font-family: var(--font-family);
}

/* Estadísticas elegantes */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-item {
  background: var(--color-white-05);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--color-white-10);
  transition: all 0.3s ease;
  text-align: center;
}

.stat-item:hover {
  background: var(--color-white-10);
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.stat-label {
  display: block;
  font-size: 0.7rem;
  color: var(--color-white-90);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  font-family: var(--font-family);
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-accent);
  text-shadow: 0 0 10px var(--color-accent-30);
  margin-bottom: 0.5rem;
}

.stat-bar {
  width: 100%;
  height: 4px;
  background: var(--color-white-10);
  border-radius: 2px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1.5s ease-out;
  animation: fillBar 2s ease-out;
}

@keyframes fillBar {
  from {
    width: 0%;
  }
}

.pick-fill {
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-80));
}

.win-fill {
  background: linear-gradient(90deg, var(--color-accent-60), var(--color-accent));
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-wrapper {
    padding: 0 1.5rem;
  }

  .title-text {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 1rem;
  }

  .header {
    padding: 1.5rem 0;
    margin-bottom: 2rem;
  }

  .title-text {
    font-size: 2.5rem;
  }

  .tagline-text {
    font-size: 1rem;
    letter-spacing: 0.2em;
  }

  .controls-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
    margin-bottom: 2rem;
  }

  .search-container {
    min-width: unset;
    width: 100%;
  }

  .role-filters {
    justify-content: center;
    width: 100%;
  }

  .agents-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .agent-card {
    padding: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .header {
    padding: 1rem 0;
    margin-bottom: 1.5rem;
  }

  .title-text {
    font-size: 2rem;
  }

  .tagline-text {
    font-size: 0.9rem;
  }

  .controls-container {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .agent-card {
    padding: 1.25rem;
  }

  .agent-avatar {
    width: 70px;
    height: 70px;
    margin-bottom: 1rem;
  }

  .agent-image {
    width: 70px;
    height: 70px;
  }

  .avatar-glow {
    width: 85px;
    height: 85px;
  }

  .agent-name {
    font-size: 1.2rem;
    letter-spacing: 1px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .stat-item {
    padding: 0.75rem;
  }

  .role-filters {
    gap: 0.4rem;
  }

  .role-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }
}
</style>
