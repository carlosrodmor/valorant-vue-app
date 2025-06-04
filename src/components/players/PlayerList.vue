<template>
  <div class="top-players-section">
    <h2 class="section-title"><span class="title-accent">TOP</span> JUGADORES</h2>

    <div class="players-grid">
      <PlayerCard
        v-for="(player, index) in players.slice(0, 3)"
        :key="player.puuid"
        :player="player"
        :rank="index + 1"
        :tier-name="getTierName(player.tier)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayerCard from "./PlayerCard.vue";

interface Player {
  puuid: string;
  name: string;
  tag: string;
  leaderboard_rank: number;
  tier: number;
  rr: number;
  wins: number;
}

interface Props {
  players: Player[];
  getTierName: (tier: number) => string;
}

defineProps<Props>();
</script>

<style scoped>
.top-players-section {
  width: 100%;
  max-width: 900px;
  margin: 2rem 0;
}

.section-title {
  font-family: var(--font-family);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-white);
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.title-accent {
  color: var(--color-accent);
  text-shadow: 0 0 20px var(--color-accent-50);
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .players-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }
}
</style>
