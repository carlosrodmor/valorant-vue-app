<template>
  <div class="arsenal-view">
    <section class="arsenal-section">
      <div class="arsenal-content">
        <h1 class="arsenal-title">
          <span class="arsenal-highlight">ARSENAL</span>
          DE COMBATE
        </h1>
        <p class="arsenal-description">
          Cada arma cuenta una historia. Desde rifles de precisión hasta pistolas devastadoras,
          domina el arsenal completo de Valorant.
        </p>
        <div class="coming-soon">
          <div class="coming-soon-card">
            <h3>CARGANDO ARMAS</h3>
            <p>El arsenal se está preparando para el combate</p>
            <div class="loading-bar">
              <div class="loading-progress"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.arsenal-view {
  min-height: 100vh;
  padding: 4rem 2rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arsenal-section {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.arsenal-title {
  font-family: "Arial Black", Arial, sans-serif;
  font-size: 3.5rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  line-height: 1.2;
}

.arsenal-highlight {
  color: #ff4654;
  text-shadow: 0 0 20px rgba(255, 70, 84, 0.5);
}

.arsenal-description {
  font-size: 1.2rem;
  color: #b8b8b8;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.coming-soon {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.coming-soon-card {
  background: linear-gradient(135deg, rgba(255, 70, 84, 0.1), rgba(17, 24, 35, 0.9));
  border: 2px solid rgba(255, 70, 84, 0.3);
  border-radius: 16px;
  padding: 3rem 2rem;
  backdrop-filter: blur(10px);
  max-width: 400px;
  width: 100%;
}

.coming-soon-card h3 {
  font-family: "Arial Black", Arial, sans-serif;
  font-size: 1.5rem;
  color: #ff4654;
  margin-bottom: 1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.coming-soon-card p {
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.loading-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.loading-progress {
  width: 75%;
  height: 100%;
  background: linear-gradient(90deg, #ff4654, #ff6b7a);
  border-radius: 3px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .arsenal-title {
    font-size: 2.5rem;
  }

  .arsenal-description {
    font-size: 1rem;
  }

  .coming-soon-card {
    padding: 2rem 1.5rem;
  }
}
</style>
