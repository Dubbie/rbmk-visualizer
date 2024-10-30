<script setup>
import GridView from '@/components/GridView.vue'
import { useGameEngineStore } from '@/stores/gameEngineStore'

const gameEngineStore = useGameEngineStore()
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

      <div>
        <button @click="gameEngineStore.reset()">Reset simulation</button>
      </div>
    </div>
  </div>
</template>
