<script setup lang="ts">
// Vista principal minimalista y elegante
</script>

<template>
  <div class="home-container">
    <div class="geometric-bg">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="content-wrapper">
      <div class="hero-section">
        <div class="brand-container">
          <h1 class="brand-title">
            <span class="title-text">VALORANT</span>
            <div class="title-underline"></div>
          </h1>
          <p class="brand-tagline">Tactical Excellence Redefined</p>
        </div>

        <div class="description-container">
          <p class="main-description">
            Experimenta la fusión perfecta entre estrategia y precisión en el campo de batalla más
            competitivo del mundo.
          </p>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">5v5</span>
            <span class="stat-label">Tactical Combat</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">20+</span>
            <span class="stat-label">Unique Agents</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">∞</span>
            <span class="stat-label">Possibilities</span>
          </div>
        </div>
      </div>
    </div>

    <div class="floating-elements">
      <div class="float-element float-1"></div>
      <div class="float-element float-2"></div>
      <div class="float-element float-3"></div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--color-primary-dark) 0%,
    var(--color-secondary-dark) 50%,
    var(--color-primary-dark) 100%
  );
  overflow: hidden;
}

.geometric-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(1px);
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: linear-gradient(45deg, var(--color-accent-10), var(--color-accent-10));
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, var(--color-accent-10), var(--color-white-05));
  bottom: 20%;
  left: 15%;
  animation-delay: -7s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, var(--color-accent-10), var(--color-secondary-80));
  top: 60%;
  right: 30%;
  animation-delay: -14s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
  }
  75% {
    transform: translateY(-30px) rotate(270deg);
  }
}

.content-wrapper {
  position: relative;
  z-index: 10;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.hero-section {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  align-items: center;
}

.brand-container {
  position: relative;
}

.brand-title {
  margin: 0;
  position: relative;
  display: inline-block;
}

.title-text {
  font-family: var(--font-family);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 200;
  letter-spacing: 0.2em;
  color: var(--color-white);
  background: linear-gradient(
    135deg,
    var(--color-white) 0%,
    var(--color-accent) 50%,
    var(--color-white) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: block;
}

.title-underline {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  animation: expand 2s ease-out infinite alternate;
}

@keyframes expand {
  from {
    width: 60px;
    opacity: 0.5;
  }
  to {
    width: 120px;
    opacity: 1;
  }
}

.brand-tagline {
  font-family: var(--font-family);
  font-size: 1rem;
  font-weight: 300;
  color: var(--color-accent);
  letter-spacing: 0.1em;
  margin: 1.5rem 0 0 0;
  text-transform: uppercase;
}

.description-container {
  max-width: 600px;
}

.main-description {
  font-family: var(--font-family);
  font-size: 1.125rem;
  font-weight: 300;
  color: var(--color-white);
  line-height: 1.8;
  letter-spacing: 0.025em;
  margin: 0;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 500px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  background: var(--color-secondary-60);
  border: 1px solid var(--color-accent-20);
  border-radius: 12px;
  backdrop-filter: var(--blur-glass);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  background: var(--color-secondary-80);
  border-color: var(--color-accent-50);
  box-shadow: var(--shadow-accent);
}

.stat-number {
  font-family: var(--font-family);
  font-size: 2rem;
  font-weight: 200;
  color: var(--color-white);
  background: linear-gradient(135deg, var(--color-accent), var(--color-white));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-family: var(--font-family);
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.8;
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.float-element {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--color-accent-60);
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

.float-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.float-2 {
  top: 70%;
  right: 20%;
  animation-delay: 1s;
}

.float-3 {
  bottom: 30%;
  left: 30%;
  animation-delay: 2s;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

.hero-section {
  animation: fadeInUp 1.5s ease-out;
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

/* Responsive Design */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 1.5rem;
  }

  .hero-section {
    gap: 3rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .brand-tagline {
    font-size: 0.875rem;
  }

  .main-description {
    font-size: 1rem;
    line-height: 1.6;
  }
}

@media (max-width: 480px) {
  .hero-section {
    gap: 2.5rem;
  }

  .brand-tagline {
    font-size: 0.75rem;
  }

  .main-description {
    font-size: 0.9rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }
}
</style>
