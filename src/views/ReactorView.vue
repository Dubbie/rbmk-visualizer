<script setup>
import GridView from '@/components/GridView.vue'
</script>

<template>
  <div class="container relative h-screen" @click="fireNeutron">
    <p class="text-xl font-bold text-white text-center mb-6">
      Welcome to the reactor
    </p>

    <div class="flex justify-center">
      <div class="bg-zinc-800 rounded-xl">
        <GridView />
      </div>
    </div>
  </div>
</template>
