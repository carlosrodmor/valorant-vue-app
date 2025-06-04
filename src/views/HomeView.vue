<template>
  <div class="home-container">
    <!-- Imagen de fondo con efectos -->
    <div class="background-wrapper">
      <div class="background-image"></div>
      <div class="background-overlay"></div>
      <div class="background-gradient"></div>
    </div>

    <!-- Partículas flotantes -->
    <div class="particles-container">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
      <div class="particle particle-4"></div>
      <div class="particle particle-5"></div>
      <div class="particle particle-6"></div>
      <div class="particle particle-7"></div>
      <div class="particle particle-8"></div>
    </div>

    <!-- Elementos geométricos modernos -->
    <div class="geometric-elements">
      <div class="geo-element geo-1"></div>
      <div class="geo-element geo-2"></div>
      <div class="geo-element geo-3"></div>
      <div class="geo-element geo-4"></div>
    </div>

    <!-- Contenido principal -->
    <div class="content-wrapper">
      <div class="hero-section">
        <!-- Título principal con efectos -->
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

        <!-- Cards de características -->
        <div class="features-grid">
          <div class="feature-card">
            <div class="card-icon">
              <div class="icon-bg"></div>
              <span class="icon-text">📊</span>
            </div>
            <h3 class="card-title">Estadísticas</h3>
          </div>

          <div class="feature-card">
            <div class="card-icon">
              <div class="icon-bg"></div>
              <span class="icon-text">🎯</span>
            </div>
            <h3 class="card-title">Agentes</h3>
          </div>

          <div class="feature-card">
            <div class="card-icon">
              <div class="icon-bg"></div>
              <span class="icon-text">🗺️</span>
            </div>
            <h3 class="card-title">Mapas</h3>
          </div>
        </div>

        <!-- Call to action -->
        <div class="cta-section">
          <button class="cta-button">
            <span class="button-text">Explorar Datos</span>
            <div class="button-ripple"></div>
            <div class="button-glow"></div>
          </button>
        </div>
      </div>
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
// Efectos avanzados y animaciones
import { onMounted } from "vue";

onMounted(() => {
  // Efecto parallax para la imagen de fondo
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    const backgroundImage = document.querySelector(".background-image") as HTMLElement;
    const speed = scrolled * 0.3;

    if (backgroundImage) {
      backgroundImage.style.transform = `translateY(${speed}px)`;
    }
  };

  // Añadir listener para el scroll
  window.addEventListener("scroll", handleScroll);

  // Cleanup
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
});
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Contenido principal */
.content-wrapper {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.hero-section {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  align-items: center;
  animation: fadeInScale 1.5s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.85);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Brand container con efectos increíbles */
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

.title-prefix {
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 300;
  color: var(--color-accent);
  letter-spacing: 0.4em;
  text-transform: uppercase;
  text-shadow: 0 0 15px var(--color-accent-40);
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.title-text {
  font-family: var(--font-family);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 100;
  letter-spacing: 0.1em;
  color: transparent;
  background: linear-gradient(
    135deg,
    var(--color-white) 0%,
    var(--color-accent) 50%,
    var(--color-white) 100%
  );
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: shimmerText 3s ease-in-out infinite;
  position: relative;
  z-index: 2;
  text-shadow: 0 0 20px var(--color-accent-30);
  line-height: 1;
  margin: 0;
}

.title-suffix {
  font-family: var(--font-family);
  font-size: 1.4rem;
  font-weight: 300;
  color: var(--color-white-80);
  letter-spacing: 0.15em;
  text-transform: lowercase;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  margin-top: 0.5rem;
  opacity: 0.8;
}

.title-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-accent-25), transparent, var(--color-accent-25));
  filter: blur(25px);
  opacity: 0.7;
  animation: glowBreathe 5s ease-in-out infinite;
}

@keyframes shimmerText {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes glowBreathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.9;
  }
}

.brand-tagline {
  position: relative;
  margin: 1rem 0 0 0;
}

.tagline-text {
  font-family: var(--font-family);
  font-size: 1rem;
  font-weight: 300;
  color: var(--color-white-80);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.tagline-line {
  margin: 0.8rem auto 0;
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  animation: lineExpand 4s ease-in-out infinite;
  border-radius: 1px;
}

@keyframes lineExpand {
  0%,
  100% {
    width: 80px;
    opacity: 0.6;
  }
  50% {
    width: 140px;
    opacity: 1;
    box-shadow: 0 0 10px var(--color-accent-50);
  }
}

/* Descripción principal */
.description-container {
  max-width: 750px;
}

.main-description {
  font-family: var(--font-family);
  font-size: 1.3rem;
  font-weight: 300;
  color: var(--color-white-95);
  line-height: 1.9;
  letter-spacing: 0.03em;
  margin: 0;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.6);
  opacity: 0.95;
}

/* Grid de características con efectos modernos */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 700px;
}

.feature-card {
  position: relative;
  padding: 2rem 1.5rem;
  background: rgba(0, 3, 14, 0.4);
  border: 1px solid var(--color-accent-20);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-accent-50);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-icon {
  position: relative;
  width: 50px;
  height: 50px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-accent-25), var(--color-accent-15));
  border-radius: 16px;
  animation: iconGlow 4s ease-in-out infinite;
  transition: all 0.5s ease;
}

.feature-card:hover .icon-bg {
  background: linear-gradient(135deg, var(--color-accent-40), var(--color-accent-25));
  transform: scale(1.1);
}

.icon-text {
  position: relative;
  z-index: 2;
  font-size: 1.5rem;
}

.card-title {
  font-family: var(--font-family);
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--color-white);
  margin: 0;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 2;
}

.card-description {
  font-family: var(--font-family);
  font-size: 1rem;
  font-weight: 300;
  color: var(--color-white-85);
  line-height: 1.7;
  margin: 0;
  position: relative;
  z-index: 2;
}

/* Call to action espectacular */
.cta-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.cta-button {
  position: relative;
  padding: 1rem 2.5rem;
  background: transparent;
  border: 2px solid var(--color-accent);
  border-radius: 50px;
  color: var(--color-white);
  font-family: var(--font-family);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.button-text {
  position: relative;
  z-index: 3;
  transition: all 0.5s ease;
}

.button-ripple {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-accent-25), var(--color-accent-50));
  transform: scale(0);
  border-radius: 60px;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.button-glow {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-white), var(--color-accent));
  border-radius: 60px;
  opacity: 0;
  filter: blur(15px);
  transition: all 0.5s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  border-color: var(--color-accent-80);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.cta-button:hover .button-ripple {
  transform: scale(1);
}

.cta-button:hover .button-glow {
  opacity: 0.8;
}

.cta-button:hover .button-text {
  color: var(--color-white);
  text-shadow: 0 0 10px var(--color-accent);
}

.secondary-actions {
  display: flex;
  gap: 2rem;
}

.secondary-btn {
  padding: 1rem 2rem;
  background: transparent;
  border: 1px solid var(--color-white-35);
  border-radius: 30px;
  color: var(--color-white-90);
  font-family: var(--font-family);
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
}

.secondary-btn:hover {
  border-color: var(--color-accent-70);
  color: var(--color-accent);
  background: var(--color-accent-08);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
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

/* Responsive Design Avanzado */
@media (max-width: 1024px) {
  .content-wrapper {
    padding: 0 1.5rem;
  }

  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
  }

  .brand-icon {
    width: 75px;
    height: 75px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    gap: 3rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.8rem;
  }

  .brand-icon {
    width: 65px;
    height: 65px;
  }

  .main-description {
    font-size: 1.15rem;
    line-height: 1.7;
  }

  .secondary-actions {
    flex-direction: column;
    gap: 1.2rem;
  }

  .feature-card {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 0 1rem;
  }

  .hero-section {
    gap: 2.5rem;
  }

  .feature-card {
    padding: 1.8rem 1.2rem;
  }

  .cta-button {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }

  .tagline-text {
    font-size: 1rem;
    letter-spacing: 0.2em;
  }

  .main-description {
    font-size: 1.05rem;
    line-height: 1.6;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .card-description {
    font-size: 0.95rem;
  }
}

/* Animación de entrada para todo el componente */
.home-container {
  animation: pageEnter 2s ease-out;
}

@keyframes pageEnter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
