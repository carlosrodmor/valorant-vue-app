<script setup lang="ts">
// Script vacío ya que no necesitamos importaciones
</script>

<template>
  <div class="home-view">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          BIENVENIDO A
          <span class="hero-highlight">VALORANT</span>
        </h1>
        <p class="hero-description">
          Experimenta el juego de disparos táctico más competitivo del mundo
        </p>
        <div class="hero-actions">
          <button class="cta-button primary">JUGAR AHORA</button>
          <button class="cta-button secondary">VER TRÁILER</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-content {
  padding: 2rem 0;
}

.hero-title {
  font-family: "Arial Black", Arial, sans-serif;
  font-size: 3.5rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  line-height: 1.2;
}

.hero-highlight {
  color: #ff4654;
  text-shadow: 0 0 20px rgba(255, 70, 84, 0.5);
}

.hero-description {
  font-size: 1.2rem;
  color: #b8b8b8;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  font-family: "Arial Black", Arial, sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 1rem 2.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cta-button.primary {
  background: linear-gradient(135deg, #ff4654, #ff6b7a);
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(255, 70, 84, 0.4);
}

.cta-button.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 70, 84, 0.6);
  background: linear-gradient(135deg, #ff6b7a, #ff4654);
}

.cta-button.secondary {
  background: transparent;
  color: #ffffff;
  border: 2px solid #ff4654;
  box-shadow: 0 6px 20px rgba(255, 70, 84, 0.2);
}

.cta-button.secondary:hover {
  background: rgba(255, 70, 84, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 70, 84, 0.3);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .cta-button {
    width: 250px;
  }
}
</style>
