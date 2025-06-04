<template>
  <nav class="valorant-navbar">
    <div class="navbar-container">
      <!-- Logo/Brand -->
      <div class="navbar-brand">
        <RouterLink to="/" class="brand-link">
          <span class="brand-text">VALORANT</span>
          <div class="brand-accent"></div>
        </RouterLink>
      </div>

      <!-- Navigation Links -->
      <div class="navbar-nav">
        <RouterLink to="/" class="nav-link">
          <span class="nav-text">INICIO</span>
        </RouterLink>
        <RouterLink to="/agentes" class="nav-link">
          <span class="nav-text">AGENTES</span>
        </RouterLink>
        <RouterLink to="/mapas" class="nav-link">
          <span class="nav-text">MAPAS</span>
        </RouterLink>
        <RouterLink to="/arsenal" class="nav-link">
          <span class="nav-text">ARSENAL</span>
        </RouterLink>
      </div>

      <!-- Play Button -->
      <div class="navbar-actions">
        <button class="play-btn">
          <span>JUGAR</span>
          <div class="btn-glow"></div>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

// Exportación por defecto para que pueda ser importado correctamente
defineOptions({
  name: "Navbar",
});
</script>

<style scoped>
.valorant-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #0a0e13 0%, #111823 100%);
  border-bottom: 2px solid #ff4654;
  backdrop-filter: blur(10px);
  padding: 0;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  height: 70px;
}

/* Brand Styling */
.navbar-brand {
  position: relative;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  position: relative;
}

.brand-text {
  font-family: "Arial Black", Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.brand-accent {
  width: 4px;
  height: 24px;
  background: linear-gradient(45deg, #ff4654, #ff6b7a);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.brand-link:hover .brand-text {
  color: #ff4654;
  text-shadow: 0 0 10px rgba(255, 70, 84, 0.5);
}

.brand-link:hover .brand-accent {
  height: 30px;
  box-shadow: 0 0 15px rgba(255, 70, 84, 0.7);
}

/* Navigation Links */
.navbar-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  position: relative;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.nav-text {
  font-family: "Arial", sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.nav-link::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 70, 84, 0.2), transparent);
  transition: left 0.5s ease;
}

.nav-link:hover::before {
  left: 100%;
}

.nav-link:hover .nav-text {
  color: #ff4654;
}

.nav-link.router-link-active .nav-text {
  color: #ff4654;
}

.nav-link.router-link-active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff4654, transparent);
}

/* Play Button */
.navbar-actions {
  position: relative;
}

.play-btn {
  position: relative;
  background: linear-gradient(135deg, #ff4654, #ff6b7a);
  border: none;
  color: #ffffff;
  font-family: "Arial Black", Arial, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(255, 70, 84, 0.3);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
}

.play-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 70, 84, 0.5);
  background: linear-gradient(135deg, #ff6b7a, #ff4654);
}

.play-btn:hover .btn-glow {
  left: 100%;
}

.play-btn:active {
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar-container {
    padding: 1rem;
  }

  .navbar-nav {
    gap: 1rem;
  }

  .nav-text {
    font-size: 0.8rem;
  }

  .brand-text {
    font-size: 1.2rem;
  }

  .play-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .navbar-nav {
    display: none;
  }

  .navbar-container {
    justify-content: space-between;
  }
}
</style>
