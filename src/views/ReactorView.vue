<script setup>
import GridView from '@/components/GridView.vue'
import { TARGET_NEUTRON_COUNT } from '@/constants'
import { useGameEngineStore } from '@/stores/gameEngineStore'
import { computed } from 'vue'

const gameEngineStore = useGameEngineStore()
const isRunning = computed(() => gameEngineStore.isRunning)
const neutronCount = computed(() => gameEngineStore.neutrons.length)

const toggleGameState = () => {
  if (isRunning.value) {
    gameEngineStore.stop()
  } else {
    gameEngineStore.start()
  }
}

const arrowSvg = computed(() => {
  if (gameEngineStore.neutrons.length >= TARGET_NEUTRON_COUNT) {
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
</svg>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
</svg>`
})
</script>

<template>
  <div class="container relative h-screen" @click="fireNeutron">
    <p class="text-xl font-bold text-white text-center mb-6">
      Welcome to the reactor
    </p>

    <div class="flex justify-center items-center gap-x-2">
      <p class="font-black text-lg">{{ neutronCount }}</p>
      <div v-html="arrowSvg"></div>
    </div>

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
