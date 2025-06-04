<template>
  <div class="brand-container">
    <div class="brand-icon">
      <div class="icon-core"></div>
      <div class="icon-rings">
        <div class="ring ring-1"></div>
        <div class="ring ring-2"></div>
        <div class="ring ring-3"></div>
      </div>
    </div>

    <h1 class="brand-title">
      <span class="title-text">TACTICAL NEXUS</span>
      <div class="title-glow"></div>
    </h1>

    <p class="brand-tagline">
      <span class="tagline-text">Datos y Estadísticas de VALORANT</span>
    </p>
  </div>
</template>

<script setup lang="ts">
// No necesita lógica adicional - es puramente presentacional
</script>

<style scoped>
.brand-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  max-width: 800px;
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
  box-shadow: 0 0 20px var(--color-accent-70), 0 0 40px var(--color-accent-40),
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
  border: 1px solid var(--color-accent-40);
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
  animation-delay: 1.5s;
}

.ring-3 {
  width: 75px;
  height: 75px;
  margin: -37.5px 0 0 -37.5px;
  animation-delay: 3s;
}

@keyframes corePulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 20px var(--color-accent-70), 0 0 40px var(--color-accent-40),
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
  text-shadow: 0 0 15px var(--color-accent-40);
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 1024px) {
  .brand-icon {
    width: 75px;
    height: 75px;
  }

  .title-text {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .brand-icon {
    width: 65px;
    height: 65px;
  }

  .title-text {
    font-size: 2.5rem;
  }

  .tagline-text {
    font-size: 1rem;
    letter-spacing: 0.2em;
  }
}

@media (max-width: 480px) {
  .title-text {
    font-size: 2rem;
  }

  .tagline-text {
    font-size: 0.9rem;
  }
}
</style>
