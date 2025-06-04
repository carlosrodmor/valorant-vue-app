<template>
  <div class="player-card">
    <div class="player-rank">
      <span class="rank-number">#{{ rank }}</span>
    </div>

    <div class="player-info">
      <h3 class="player-name">{{ player.name }}</h3>
      <p class="player-tag">#{{ player.tag }}</p>
      <div class="player-stats">
        <span class="player-tier">{{ tierName }}</span>
        <span class="player-rr">{{ player.rr }} RR</span>
      </div>
    </div>

    <div class="player-badge">
      <div class="badge-icon">👑</div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  player: Player;
  rank: number;
  tierName: string;
}

defineProps<Props>();
</script>

<style scoped>
.player-card {
  position: relative;
  background: rgba(0, 3, 14, 0.6);
  border: 1px solid var(--color-accent-20);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
  overflow: hidden;
}

.player-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-accent-50);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.player-rank {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.rank-number {
  font-family: var(--font-family);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-accent);
  background: rgba(188, 164, 255, 0.15);
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
}

.player-info {
  margin-bottom: 1rem;
}

.player-name {
  font-family: var(--font-family);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-white);
  margin: 0 0 0.3rem 0;
  letter-spacing: 0.05em;
}

.player-tag {
  font-size: 0.9rem;
  color: var(--color-accent-80);
  margin: 0 0 0.8rem 0;
}

.player-stats {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.player-tier {
  font-size: 0.9rem;
  color: var(--color-white-90);
  font-weight: 500;
}

.player-rr {
  font-size: 1.1rem;
  color: var(--color-accent);
  font-weight: 600;
}

.player-badge {
  display: flex;
  justify-content: center;
  align-items: center;
}

.badge-icon {
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .player-card {
    padding: 1rem;
  }

  .player-name {
    font-size: 1.1rem;
  }
}
</style>
