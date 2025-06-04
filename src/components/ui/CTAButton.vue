<template>
  <div class="cta-section">
    <button class="cta-button" @click="$emit('click')" :disabled="disabled">
      <span class="button-text">{{ text }}</span>
      <div class="button-ripple"></div>
      <div class="button-glow"></div>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string;
  disabled?: boolean;
}

interface Emits {
  click: [];
}

withDefaults(defineProps<Props>(), {
  text: "Explorar Datos",
  disabled: false,
});

defineEmits<Emits>();
</script>

<style scoped>
.cta-section {
  margin-top: 2rem;
}

.cta-button {
  position: relative;
  padding: 1.2rem 3rem;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-80));
  border: none;
  border-radius: 30px;
  color: var(--color-primary-dark);
  font-family: var(--font-family);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s ease;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: 0 8px 30px var(--color-accent-30);
}

.cta-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px var(--color-accent-40);
}

.cta-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-ripple {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, var(--color-white-20) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cta-button:hover:not(:disabled) .button-ripple {
  opacity: 1;
}

.button-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--color-accent), transparent, var(--color-accent));
  border-radius: 32px;
  z-index: 1;
  filter: blur(8px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cta-button:hover:not(:disabled) .button-glow {
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 480px) {
  .cta-button {
    padding: 1rem 2.5rem;
    font-size: 1rem;
  }
}
</style>
