<template>
  <div class="agent-card" :class="{ selected: isSelected }" @click="$emit('select', agent)">
    <div class="agent-image-container">
      <img
        :src="agent.displayIcon"
        :alt="agent.displayName"
        class="agent-image"
        @error="handleImageError"
      />
      <div class="agent-role-icon">
        <img :src="agent.role.displayIcon" :alt="agent.role.displayName" class="role-icon" />
      </div>
    </div>

    <div class="agent-info">
      <h3 class="agent-name">{{ agent.displayName }}</h3>
      <p class="agent-role">{{ agent.role.displayName }}</p>

      <div class="agent-stats" v-if="pickRate && winRate">
        <span class="stat-item">Pick: {{ pickRate }}</span>
        <span class="stat-item">Win: {{ winRate }}</span>
      </div>
    </div>

    <div class="card-glow"></div>
  </div>
</template>

<script setup lang="ts">
import type { Agent } from "@/types";

interface Props {
  agent: Agent;
  isSelected?: boolean;
  pickRate?: string;
  winRate?: string;
}

interface Emits {
  select: [agent: Agent];
}

defineProps<Props>();
defineEmits<Emits>();

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = "none";
};
</script>

<style scoped>
.agent-card {
  position: relative;
  background: rgba(0, 3, 14, 0.4);
  border: 1px solid var(--color-accent-20);
  border-radius: 12px;
  padding: 1.5rem 1rem;
  text-align: center;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.agent-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-accent-50);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.agent-card.selected {
  border-color: var(--color-accent);
  box-shadow: 0 0 20px var(--color-accent-30);
}

.agent-image-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
}

.agent-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--color-accent-30);
  transition: all 0.3s ease;
}

.agent-card:hover .agent-image {
  border-color: var(--color-accent);
  box-shadow: 0 0 15px var(--color-accent-40);
}

.agent-role-icon {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 25px;
  height: 25px;
  background: var(--color-primary-dark);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-accent-30);
}

.role-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) saturate(100%) invert(72%) sepia(34%) saturate(354%) hue-rotate(215deg)
    brightness(106%) contrast(101%);
}

.agent-info {
  z-index: 2;
  position: relative;
}

.agent-name {
  font-family: var(--font-family);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-white);
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.05em;
}

.agent-role {
  font-size: 0.9rem;
  color: var(--color-accent);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.agent-stats {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  justify-content: center;
}

.stat-item {
  font-size: 0.75rem;
  color: var(--color-accent);
  background: rgba(188, 164, 255, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-weight: 500;
}

.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, var(--color-accent-10), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.agent-card:hover .card-glow {
  opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .agent-card {
    padding: 1rem 0.8rem;
  }

  .agent-image-container {
    width: 60px;
    height: 60px;
  }

  .stat-item {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
  }
}
</style>
