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
  background: #0a0e13;
  color: #ffffff;
  overflow-x: hidden;
}

.main-content {
  padding-top: 70px;
  min-height: calc(100vh - 70px);
  position: relative;
}
</style>
