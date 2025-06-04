<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <!-- Logo/Brand -->
      <div class="brand-section">
        <RouterLink to="/" class="brand-link">
          <div class="brand-icon">
            <div class="icon-dot"></div>
            <div class="icon-ring"></div>
          </div>
          <span class="brand-text">VALORANT</span>
        </RouterLink>
      </div>

      <!-- Navigation Menu -->
      <div class="nav-menu">
        <div class="nav-links">
          <RouterLink to="/" class="nav-link">
            <span class="link-text">Inicio</span>
            <div class="link-indicator"></div>
          </RouterLink>
          <RouterLink to="/agents" class="nav-link">
            <span class="link-text">Agentes</span>
            <div class="link-indicator"></div>
          </RouterLink>
          <RouterLink to="/maps" class="nav-link">
            <span class="link-text">Mapas</span>
            <div class="link-indicator"></div>
          </RouterLink>
          <RouterLink to="/arsenal" class="nav-link">
            <span class="link-text">Arsenal</span>
            <div class="link-indicator"></div>
          </RouterLink>
        </div>
      </div>

      <!-- Action Button -->
      <div class="action-section">
        <button class="play-button">
          <span class="button-text">Jugar Ahora</span>
          <div class="button-glow"></div>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Toggle -->
    <div class="mobile-menu-toggle">
      <div class="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 3, 14, 0.8);
  backdrop-filter: var(--blur-glass);
  border-bottom: 1px solid var(--color-white-05);
  transition: all 0.3s ease;
}

.navbar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    var(--color-accent-10) 0%,
    var(--color-accent-10) 50%,
    var(--color-accent-10) 100%
  );
  pointer-events: none;
}

.navbar-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 80px;
  position: relative;
  z-index: 1;
}

/* Brand Section */
.brand-section {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.brand-icon {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-white));
  border-radius: 50%;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.icon-ring {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 1px solid var(--color-accent-30);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.brand-link:hover .icon-dot {
  transform: scale(1.2);
  box-shadow: 0 0 20px var(--color-accent-60);
}

.brand-link:hover .icon-ring {
  transform: scale(1.2);
  border-color: var(--color-accent-80);
}

.brand-text {
  font-family: var(--font-family);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--color-white);
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
}

.brand-link:hover .brand-text {
  color: var(--color-accent);
}

/* Navigation Menu */
.nav-menu {
  display: flex;
  align-items: center;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
}

.link-text {
  font-family: var(--font-family);
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--color-white-90);
  letter-spacing: 0.025em;
  transition: all 0.3s ease;
}

.link-indicator {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-white));
  transition: all 0.3s ease;
}

.nav-link:hover .link-text,
.nav-link.router-link-active .link-text {
  color: var(--color-white);
}

.nav-link:hover .link-indicator,
.nav-link.router-link-active .link-indicator {
  width: 100%;
}

/* Action Section */
.action-section {
  display: flex;
  align-items: center;
}

.play-button {
  position: relative;
  background: transparent;
  border: 1px solid var(--color-accent-30);
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  color: var(--color-white);
  font-family: var(--font-family);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.025em;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-accent-10), var(--color-accent-20));
  opacity: 0;
  transition: all 0.3s ease;
}

.play-button:hover {
  border-color: var(--color-accent-60);
  transform: translateY(-1px);
}

.play-button:hover .button-glow {
  opacity: 1;
}

.play-button:hover .button-text {
  color: var(--color-accent);
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hamburger span {
  width: 20px;
  height: 1px;
  background: var(--color-white-90);
  transition: all 0.3s ease;
}

.mobile-menu-toggle:hover .hamburger span {
  background: var(--color-white);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .navbar-inner {
    padding: 0 1.5rem;
  }

  .nav-links {
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .navbar-inner {
    padding: 0 1rem;
    height: 70px;
  }

  .brand-text {
    font-size: 1.1rem;
  }

  .action-section {
    display: none;
  }
}

@media (max-width: 480px) {
  .brand-text {
    font-size: 1rem;
    letter-spacing: 0.05em;
  }

  .icon-ring,
  .icon-dot {
    transform: scale(0.9);
  }
}

/* Scroll Effect */
.navbar.scrolled {
  background: rgba(0, 3, 14, 0.95);
  border-bottom-color: var(--color-white-10);
}

/* Animation for mount */
.navbar {
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
