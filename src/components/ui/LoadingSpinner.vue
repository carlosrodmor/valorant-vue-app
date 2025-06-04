<template>
  <div class="loading-section">
    <div class="loading-card">
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string;
}

withDefaults(defineProps<Props>(), {
  text: "Cargando...",
});
</script>

<style scoped>
.loading-section {
  display: flex;
  justify-content: center;
  margin: 3rem 0;
}

.loading-card {
  background: rgba(0, 3, 14, 0.6);
  border: 1px solid var(--color-accent-20);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-accent-20);
  border-top: 3px solid var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--color-white-90);
  font-size: 1rem;
  margin: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
