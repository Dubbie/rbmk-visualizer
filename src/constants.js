export const DEBUG = false

export const ELEMENT_TYPES = {
  URANIUM: {
    type: 'uranium',
    color: 'rgb(37,99,235)',
  },
  INERT: {
    type: 'inert',
    color: 'rgb(60,60,60)',
  },
  XENON: {
    type: 'xenon',
    color: 'rgb(120,120,120)',
  },
}
export const RICHNESS = 15
export const ROD_SPEED = 0.15

export const MIN_DECAY_TIME = 1000 * 1
export const MAX_DECAY_TIME = 1000 * 120

export const MIN_URANIUM_TIME = 0
export const MAX_URANIUM_TIME = 120

export const TARGET_NEUTRON_COUNT = 40

// Water stuff
export const EVAPORATION_THRESHOLD = 100 // Temp at which water evaporates
export const COOLING_RATE = 5 // Temperature decrease per cooling interval
export const COOLING_DELAY = 0 // Delay before cooling starts
export const HEATING_RATE = 0.75 // Temperate increase per neutron
export const ABSORPTION_CHANCE = 0.008 // Chance to absorb a neutron
