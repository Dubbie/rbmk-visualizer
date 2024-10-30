<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useDarkMode } from './composables/useDarkMode.js'

const { isDark, toggleDarkMode } = useDarkMode()
</script>

<template>
  <div class="min-h-svh dark:text-zinc-500 dark:bg-zinc-900">
    <header>
      <div class="wrapper">
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>

        <button @click="toggleDarkMode">{{ isDark ? 'Light' : 'Dark' }}</button>
      </div>
    </header>

    <RouterView />
  </div>
</template>
