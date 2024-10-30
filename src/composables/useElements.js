import { ref } from 'vue'

export function useElements() {
  const elements = ref({
    uranium: { color: 'bg-blue-500', label: 'Uranium' },
    inert: { color: 'bg-gray-400', label: 'Inert' },
    xenon: { color: 'bg-gray-600', label: 'Xenon' },
    empty: { color: 'bg-white', label: 'Empty' },
  })

  const getElementProperties = elementKey =>
    elements.value[elementKey] || elements.value.empty

  return { elements, getElementProperties }
}
