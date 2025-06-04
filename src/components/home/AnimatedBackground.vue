<template>
  <div class="background-container">
    <!-- Imagen de fondo con efectos -->
    <div class="background-wrapper">
      <div class="background-image"></div>
      <div class="background-overlay"></div>
      <div class="background-gradient"></div>
    </div>

    <!-- Partículas flotantes -->
    <div class="particles-container">
      <div v-for="i in 8" :key="`particle-${i}`" :class="`particle particle-${i}`"></div>
    </div>

    <!-- Elementos geométricos modernos -->
    <div class="geometric-elements">
      <div v-for="i in 4" :key="`geo-${i}`" :class="`geo-element geo-${i}`"></div>
    </div>

    <!-- Elementos decorativos adicionales -->
    <div class="decorative-elements">
      <div class="deco-line deco-line-1"></div>
      <div class="deco-line deco-line-2"></div>
      <div class="deco-dot deco-dot-1"></div>
      <div class="deco-dot deco-dot-2"></div>
      <div class="deco-dot deco-dot-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

let scrollHandler: (() => void) | null = null;

onMounted(() => {
  // Efecto parallax para la imagen de fondo
  scrollHandler = () => {
    const scrolled = window.pageYOffset;
    const backgroundImage = document.querySelector(".background-image") as HTMLElement;
    const speed = scrolled * 0.3;

    if (backgroundImage) {
      backgroundImage.style.transform = `translateY(${speed}px)`;
    }
  };

  window.addEventListener("scroll", scrollHandler);
});

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
  }
});
</script>

<style scoped>
.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Background con imagen de Unsplash espectacular */
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
  filter: brightness(0.25) contrast(1.3) saturate(1.2);
  transform-origin: center;
  animation: subtleZoom 25s ease-in-out infinite alternate;
}

@keyframes subtleZoom {
  from {
    transform: scale(1);
    filter: brightness(0.25) contrast(1.3) saturate(1.2);
  }
  to {
    transform: scale(1.08);
    filter: brightness(0.3) contrast(1.2) saturate(1.1);
  }
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 25% 25%, var(--color-accent-15) 0%, transparent 45%),
    radial-gradient(circle at 75% 75%, var(--color-secondary-15) 0%, transparent 45%),
    radial-gradient(circle at 50% 50%, var(--color-primary-dark-20) 0%, transparent 70%),
    linear-gradient(135deg, var(--color-primary-dark-85) 0%, var(--color-secondary-dark-75) 100%);
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

/* Partículas flotantes animadas */
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

/* Posicionamiento y animaciones únicas para cada partícula */
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
  left: 30%;
  animation-delay: 2s;
  animation-duration: 9s;
}
.particle-4 {
  left: 40%;
  animation-delay: 3s;
  animation-duration: 6s;
}
.particle-5 {
  left: 50%;
  animation-delay: 4s;
  animation-duration: 8s;
}
.particle-6 {
  left: 60%;
  animation-delay: 5s;
  animation-duration: 7s;
}
.particle-7 {
  left: 70%;
  animation-delay: 6s;
  animation-duration: 9s;
}
.particle-8 {
  left: 80%;
  animation-delay: 7s;
  animation-duration: 6s;
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

/* Elementos geométricos modernos */
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
  border: 1px solid var(--color-accent-25);
  animation: rotate 40s linear infinite;
}

.geo-1 {
  width: 250px;
  height: 250px;
  top: 8%;
  right: 8%;
  border-radius: 50%;
  animation-direction: normal;
  border-style: dashed;
  opacity: 0.3;
}

.geo-2 {
  width: 120px;
  height: 120px;
  bottom: 15%;
  left: 8%;
  transform: rotate(45deg);
  animation-direction: reverse;
  animation-duration: 30s;
  opacity: 0.4;
}

.geo-3 {
  width: 180px;
  height: 180px;
  top: 45%;
  left: 3%;
  border-radius: 35%;
  animation-duration: 50s;
  opacity: 0.25;
}

.geo-4 {
  width: 90px;
  height: 90px;
  top: 25%;
  right: 25%;
  border-radius: 25px;
  animation-direction: reverse;
  animation-duration: 25s;
  opacity: 0.35;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Elementos decorativos avanzados */
.decorative-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 4;
}

.deco-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, var(--color-accent-35), transparent);
  height: 1px;
  animation: lineFloat 10s ease-in-out infinite;
}

.deco-line-1 {
  top: 20%;
  left: 8%;
  width: 250px;
  animation-delay: 0s;
}

.deco-line-2 {
  bottom: 25%;
  right: 12%;
  width: 200px;
  animation-delay: 3s;
}

.deco-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--color-accent);
  border-radius: 50%;
  animation: dotPulse 5s ease-in-out infinite;
  box-shadow: 0 0 10px var(--color-accent-60);
}

.deco-dot-1 {
  top: 15%;
  left: 18%;
  animation-delay: 0s;
}
.deco-dot-2 {
  top: 65%;
  right: 20%;
  animation-delay: 2s;
}
.deco-dot-3 {
  bottom: 20%;
  left: 12%;
  animation-delay: 4s;
}

@keyframes lineFloat {
  0%,
  100% {
    opacity: 0.4;
    transform: translateY(0) scaleX(1);
  }
  50% {
    opacity: 1;
    transform: translateY(-15px) scaleX(1.2);
  }
}

@keyframes dotPulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(2);
    box-shadow: 0 0 20px var(--color-accent);
  }
}
</style>
