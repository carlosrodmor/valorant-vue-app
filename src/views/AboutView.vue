<template>
  <div class="about-view">
    <section class="about-section">
      <div class="about-content">
        <h1 class="about-title">
          ACERCA DE
          <span class="about-highlight">VALORANT</span>
        </h1>
        <p class="about-description">
          Un juego de disparos táctico 5v5 basado en personajes donde la creatividad es tu mejor
          arma.
        </p>
        <div class="features-grid">
          <div class="feature-card">
            <h3>AGENTES ÚNICOS</h3>
            <p>Elige entre una selección de agentes con habilidades distintivas</p>
          </div>
          <div class="feature-card">
            <h3>MAPAS TÁCTICOS</h3>
            <p>Domina mapas diseñados específicamente para el juego competitivo</p>
          </div>
          <div class="feature-card">
            <h3>COMPETITIVO</h3>
            <p>Sube de rango en el modo competitivo más desafiante</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-view {
  min-height: 100vh;
  padding: 4rem 2rem 2rem;
}

.about-section {
  max-width: 1200px;
  margin: 0 auto;
}

.about-content {
  text-align: center;
  margin-bottom: 4rem;
}

.about-title {
  font-family: "Arial Black", Arial, sans-serif;
  font-size: 3rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.about-highlight {
  color: #ff4654;
  text-shadow: 0 0 20px rgba(255, 70, 84, 0.5);
}

.about-description {
  font-size: 1.3rem;
  color: #b8b8b8;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: linear-gradient(135deg, rgba(255, 70, 84, 0.1), rgba(17, 24, 35, 0.8));
  border: 1px solid rgba(255, 70, 84, 0.3);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: #ff4654;
  box-shadow: 0 10px 30px rgba(255, 70, 84, 0.3);
}

.feature-card h3 {
  font-family: "Arial Black", Arial, sans-serif;
  font-size: 1.3rem;
  color: #ff4654;
  margin-bottom: 1rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.feature-card p {
  color: #ffffff;
  line-height: 1.6;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .about-title {
    font-size: 2.5rem;
  }

  .about-description {
    font-size: 1.1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-card {
    padding: 1.5rem;
  }
}
</style>
