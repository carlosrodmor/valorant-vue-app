<template>
  <div class="featured-agents-section">
    <h2 class="section-title"><span class="title-accent">TOP 5</span> MÁS JUGADOS</h2>

    <div class="agents-grid">
      <AgentCard
        v-for="agent in agents"
        :key="agent.uuid"
        :agent="agent"
        :is-selected="selectedAgent?.uuid === agent.uuid"
        :pick-rate="getAgentPickRate?.(agent.displayName)"
        :win-rate="getAgentWinRate?.(agent.displayName)"
        @select="$emit('agent-selected', $event)"
      />
    </div>

    <!-- Información del agente seleccionado -->
    <div class="agent-details" v-if="selectedAgent">
      <div class="agent-details-content">
        <div class="agent-description">
          <h3 class="agent-detail-name">{{ selectedAgent.displayName }}</h3>
          <p class="agent-detail-desc">{{ selectedAgent.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Agent } from "@/types";
import AgentCard from "./AgentCard.vue";

interface Props {
  agents: Agent[];
  selectedAgent?: Agent | null;
  getAgentPickRate?: (agentName: string) => string;
  getAgentWinRate?: (agentName: string) => string;
}

interface Emits {
  "agent-selected": [agent: Agent];
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.featured-agents-section {
  width: 100%;
  max-width: 900px;
  margin: 2rem 0;
}

.section-title {
  font-family: var(--font-family);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-white);
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.title-accent {
  color: var(--color-accent);
  text-shadow: 0 0 20px var(--color-accent-50);
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

/* Detalles del agente seleccionado */
.agent-details {
  background: rgba(0, 3, 14, 0.6);
  border: 1px solid var(--color-accent-20);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(15px);
  animation: fadeInUp 0.3s ease-out;
}

.agent-details-content {
  text-align: center;
}

.agent-detail-name {
  font-family: var(--font-family);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
  margin: 0 0 1rem 0;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.agent-detail-desc {
  font-size: 1rem;
  color: var(--color-white-90);
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 900px) {
  .agents-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .agents-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .agents-grid {
    grid-template-columns: 1fr 1fr;
  }

  .agent-detail-desc {
    font-size: 0.9rem;
  }
}
</style>
