import { ref, watchEffect } from 'vue'

export function useDarkMode() {
  const isDark = ref(localStorage.getItem('theme') === 'dark')

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  // Initialize based on localStorage or system preference
  watchEffect(() => {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    isDark.value = localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDark
    document.documentElement.classList.toggle('dark', isDark.value)
  })

  return { isDark, toggleDarkMode }
}
