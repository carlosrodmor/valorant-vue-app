<template>
  <nav class="navigation-bar">
    <div class="navbar-container">
      <div class="navbar-content">
        <!-- Logo/Brand -->
        <div class="brand-section">
          <RouterLink to="/" class="brand-link">
            <div class="brand-icon">
              <div class="icon-dot"></div>
            </div>
            <span class="brand-text">TACTICAL NEXUS</span>
          </RouterLink>
        </div>

        <!-- Navigation Menu -->
        <div class="nav-menu">
          <RouterLink to="/" class="nav-link">
            <span class="link-text">Inicio</span>
          </RouterLink>
          <RouterLink to="/agents" class="nav-link">
            <span class="link-text">Agentes</span>
          </RouterLink>
          <RouterLink to="/maps" class="nav-link">
            <span class="link-text">Mapas</span>
          </RouterLink>
          <RouterLink to="/arsenal" class="nav-link">
            <span class="link-text">Arsenal</span>
          </RouterLink>
        </div>

        <!-- Action Button -->
        <div class="action-section">
          <button class="cta-button">
            <span class="button-text">Jugar Ahora</span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="mobile-toggle">
        <span class="line"></span>
        <span class="line"></span>
        <span class="line"></span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.navigation-bar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: calc(100% - 4rem);
  max-width: 1200px;
  transition: all 0.3s ease;
}

.navbar-container {
  background: rgba(0, 3, 14, 0.95);
  backdrop-filter: var(--blur-glass);
  border: 1px solid var(--color-white-05);
  border-radius: 50px;
  padding: 0 2rem;
  height: 60px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.navbar-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Brand Section */
.brand-section {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.brand-icon {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-dot {
  width: 6px;
  height: 6px;
  background: var(--color-accent);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--color-accent-50);
  transition: all 0.3s ease;
}

.brand-link:hover .icon-dot {
  transform: scale(1.3);
  box-shadow: 0 0 12px var(--color-accent);
}

.brand-text {
  font-family: var(--font-family);
  font-size: 1rem;
  font-weight: 600;
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
  gap: 1.5rem;
}

.nav-link {
  position: relative;
  text-decoration: none;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
}

.link-text {
  font-family: var(--font-family);
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--color-white-90);
  letter-spacing: 0.025em;
  transition: all 0.3s ease;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-accent);
  transition: width 0.3s ease;
}

.nav-link:hover .link-text,
.nav-link.router-link-active .link-text {
  color: var(--color-white);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

/* Action Section */
.action-section {
  display: flex;
  align-items: center;
}

.cta-button {
  background: transparent;
  border: 1px solid var(--color-accent-30);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  color: var(--color-white);
  font-family: var(--font-family);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.025em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-10);
  color: var(--color-accent);
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 3px;
  cursor: pointer;
  padding: 0.5rem;
}

.line {
  width: 18px;
  height: 1px;
  background: var(--color-white-90);
  transition: all 0.3s ease;
}

.mobile-toggle:hover .line {
  background: var(--color-accent);
}

/* Responsive Design */
@media (max-width: 768px) {
  .navigation-bar {
    top: 15px;
    width: calc(100% - 2rem);
  }

  .navbar-container {
    padding: 0 1.5rem;
    height: 55px;
  }

  .nav-menu {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }

  .action-section {
    display: none;
  }

  .brand-text {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .navigation-bar {
    width: calc(100% - 1rem);
  }

  .navbar-container {
    padding: 0 1rem;
  }

  .brand-text {
    font-size: 0.85rem;
  }

  .brand-icon {
    transform: scale(0.9);
  }
}

/* Scroll Effect */
.navigation-bar.scrolled .navbar-container {
  background: rgba(0, 3, 14, 0.98);
  border-color: var(--color-white-10);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* Mount Animation */
.navigation-bar {
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

/* Hover effect for entire navbar */
.navbar-container:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  border-color: var(--color-white-10);
}
</style>
