<script setup>
import { SortAlphabeticalDescending, SortAlphabeticalAscending, GridLarge, ViewList, ViewGrid } from 'mdue'

const props = defineProps({
  viewMode: {
    type: String,
    default: 'grid'
  }
})

const emit = defineEmits(['search', 'sort', 'view-change'])

const searchQuery = ref('')
const sortOption = ref('name-asc')

function getPriceSortTitle(option) {
  const state = getPriceSortState(option)
  const baseNames = {
    'price3m': '3-month low',
    'price1y': '1-year low', 
    'priceAll': 'All-time low'
  }
  
  if (state === 'off') {
    return `Sort by ${baseNames[option]}`
  } else {
    return `${baseNames[option]} (${state === 'desc' ? 'high to low' : 'low to high'})`
  }
}

function getPriceSortLabel(option) {
  const state = getPriceSortState(option)
  const baseLabels = {
    'price3m': '3m',
    'price1y': '1y',
    'priceAll': 'All'
  }
  
  const label = baseLabels[option] || ''
  if (state === 'off') {
    return label
  } else {
    return `${label}${state === 'desc' ? '↓' : '↑'}`
  }
}

function togglePriceSort(option) {
  const currentState = getPriceSortState(option)
  
  // Toggle logic: off -> desc -> asc -> desc -> asc...
  let newState
  if (currentState === 'off') {
    newState = 'desc'  // First click always starts with desc (high to low)
  } else if (currentState === 'desc') {
    newState = 'asc'   // Second click goes to asc (low to high)
  } else {
    newState = 'desc'  // Third click goes back to desc
  }
  
  sortOption.value = `${option}-${newState}`
  emit('sort', sortOption.value)
}

function getPriceSortState(option) {
  if (sortOption.value.startsWith(option)) {
    return sortOption.value.endsWith('-asc') ? 'asc' : 'desc'
  }
  return 'off'
}
</script>

<template>
  <div class="bg-gray-800 text-white p-4 pt-10 shadow-lg">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <!-- Search Box -->
        <div class="flex-1 max-w-md pl-6">
          <input
            v-model="searchQuery"
            @input="$emit('search', searchQuery)"
            type="search"
            placeholder="Search games..."
            class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <!-- Sort Options -->
        <div class="flex items-center gap-2">
          <label v-if="viewMode==='grid'" class="text-sm">Sort:</label>
          <!-- Alpha Sort -->
          <div v-if="viewMode==='grid'" class="flex bg-gray-700 rounded-lg overflow-hidden">
            <button v-for="option in ['name-asc', 'name-desc']" :key="option"
                @click="sortOption=option; $emit('sort', option)"
                :class="[ 
                    'px-4 py-2 text-sm font-medium transition-colors',
                    sortOption === option
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                ]">
                    <SortAlphabeticalAscending v-if="option=='name-asc'" />
                    <SortAlphabeticalDescending v-else />
            </button>
          </div>
          
          <!-- Price Sort -->
          <label v-if="viewMode==='grid'" class="text-sm">$:</label>
          <div v-if="viewMode==='grid'" class="flex bg-gray-700 rounded-lg overflow-hidden">
            <button v-for="option in ['price3m', 'price1y', 'priceAll']" :key="option"
                @click="togglePriceSort(option)"
                :class="[ 
                    'px-3 py-2 text-xs font-medium transition-colors border-r border-gray-600 last:border-r-0',
                    getPriceSortState(option) !== 'off'
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                ]"
                :title="getPriceSortTitle(option)">
                {{ getPriceSortLabel(option) }}
            </button>
          </div>
        </div>
        
        <!-- View Toggle -->
        <div class="flex items-center gap-2">
          <label class="text-sm">View:</label>
          <div class="flex bg-gray-700 rounded-lg overflow-hidden">
            <button
              @click="$emit('view-change', 'grid')"
              :class="[
                'px-4 py-2 text-sm font-medium transition-colors',
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              ]"
            >
              <GridLarge />
            </button>
            <button
              @click="$emit('view-change', 'list')"
              :class="[
                'px-4 py-2 text-sm font-medium transition-colors',
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              ]"
            >
              <ViewList />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>