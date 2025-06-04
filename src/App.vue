<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div class="app">
    <Navbar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e13 0%, #111823 50%, #1a1f2e 100%);
  color: #ffffff;
}

.main-content {
  padding-top: 70px; /* Para compensar la navbar fija */
  min-height: calc(100vh - 70px);
}
</style>
