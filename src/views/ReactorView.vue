<script setup>
import GridView from '@/components/GridView.vue'
import { useGameEngineStore } from '@/stores/gameEngineStore'
import { computed } from 'vue'

const gameEngineStore = useGameEngineStore()
const isRunning = computed(() => gameEngineStore.isRunning)

const toggleGameState = () => {
  if (isRunning.value) {
    gameEngineStore.stop()
  } else {
    gameEngineStore.start()
  }
}
</script>

<template>
  <div class="container relative h-screen" @click="fireNeutron">
    <p class="text-xl font-bold text-white text-center mb-6">
      Welcome to the reactor
    </p>

    <div class="flex flex-col items-center gap-y-6">
      <div class="bg-zinc-800 rounded-xl">
        <GridView />
      </div>

      <div class="flex gap-x-4">
        <button @click="gameEngineStore.reset()">Reset simulation</button>
        <button @click="toggleGameState">
          {{ isRunning ? 'Stop' : 'Start' }} simulation
        </button>
      </div>
    </div>
  </div>
</template>
