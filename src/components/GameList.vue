<script setup>
const props = defineProps({
  games: {
    type: Array,
    required: true
  },
  prices: {
    type: Array,
    required: true
  }
})

// Sorting state
const sortField = ref('')
const sortDirection = ref('asc')

// Function to get price value for sorting
const getPriceValue = (game, field) => {
  const priceData = props.prices?.find(g => g.steamID == game.steamID)
  if (!priceData) return 0
  
  switch (field) {
    case 'price3m':
      return priceData.historyLow?.m3?.amountInt || 0
    case 'price1y':
      return priceData.historyLow?.y1?.amountInt || 0
    case 'priceAll':
      return priceData.historyLow?.all?.amountInt || 0
    default:
      return 0
  }
}

// Computed property for sorted games
const sortedGames = computed(() => {
  if (!sortField.value) return props.games
  
  const sorted = [...props.games].sort((a, b) => {
    let aValue, bValue
    
    switch (sortField.value) {
      case 'name':
        aValue = a.name?.toLowerCase() || ''
        bValue = b.name?.toLowerCase() || ''
        break
      case 'steamID':
        aValue = Number(a.steamID) || 0
        bValue = Number(b.steamID) || 0
        break
      case 'quantity':
        aValue = Number(a.quantity) || 0
        bValue = Number(b.quantity) || 0
        break
      case 'baseID':
        aValue = Number(a.baseID) || 0
        bValue = Number(b.baseID) || 0
        break
      case 'price3m':
      case 'price1y':
      case 'priceAll':
        aValue = getPriceValue(a, sortField.value)
        bValue = getPriceValue(b, sortField.value)
        break
      default:
        return 0
    }
    
    if (typeof aValue === 'string') {
      return sortDirection.value === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    } else {
      return sortDirection.value === 'asc' 
        ? aValue - bValue
        : bValue - aValue
    }
  })
  
  return sorted
})

// Sort function
const sortBy = (field) => {
  if (sortField.value === field) {
    // Toggle direction if same field
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Set new field and default to ascending
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const handleImageError = (event) => {
  // Fallback to a smaller placeholder for list view
  event.target.src = `https://via.placeholder.com/64x36/374151/ffffff?text=Game`
}
</script>

<template>
  <div class="rounded-lg shadow-md overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-900 border-b">
          <tr>
            <th 
              class="px-4 py-3 text-left text-sm font-medium text-gray-400 cursor-pointer hover:text-gray-200 transition-colors"
              @click="sortBy('image')"
            >
              <div class="flex items-center">
                Image
                <span v-if="sortField === 'image'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              class="px-4 py-3 text-left text-sm font-medium text-gray-400 cursor-pointer hover:text-gray-200 transition-colors"
              @click="sortBy('name')"
            >
              <div class="flex items-center">
                Game Name
                <span v-if="sortField === 'name'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              class="px-4 py-3 text-left text-sm font-medium text-gray-400 text-right cursor-pointer hover:text-gray-200 transition-colors"
              @click="sortBy('steamID')"
            >
              <div class="flex items-center justify-end">
                Steam ID
                <span v-if="sortField === 'steamID'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              class="px-4 py-3 text-left text-sm font-medium text-gray-400 text-right cursor-pointer hover:text-gray-200 transition-colors"
              @click="sortBy('quantity')"
            >
              <div class="flex items-center justify-end">
                Quantity
                <span v-if="sortField === 'quantity'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              class="px-4 py-3 text-left text-sm font-medium text-gray-400 text-right cursor-pointer hover:text-gray-200 transition-colors"
              @click="sortBy('baseID')"
            >
              <div class="flex items-center justify-end">
                Base ID
                <span v-if="sortField === 'baseID'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              class="px-4 py-3 text-left text-sm font-medium text-gray-400 text-right cursor-pointer hover:text-gray-200 transition-colors"
              @click="sortBy('price3m')"
            >
              <div class="flex items-center justify-end">
                3m
                <span v-if="sortField === 'price3m'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              class="px-4 py-3 text-left text-sm font-medium text-gray-400 text-right cursor-pointer hover:text-gray-200 transition-colors"
              @click="sortBy('price1y')"
            >
              <div class="flex items-center justify-end">
                1y
                <span v-if="sortField === 'price1y'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th 
              class="px-4 py-3 text-left text-sm font-medium text-gray-400 text-right cursor-pointer hover:text-gray-200 transition-colors"
              @click="sortBy('priceAll')"
            >
              <div class="flex items-center justify-end">
                all
                <span v-if="sortField === 'priceAll'" class="ml-1">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr 
            v-for="game in sortedGames" 
            :key="`${game.steamID}-${game.name}`"
            class="hover:bg-gray-700 transition-colors duration-200"
          >
            <td class="px-4 py-3">
              <div class="relative max-w-fit flex">
                <img
                  :src="`https://steamcdn-a.akamaihd.net/steam/apps/${game.steamID}/header.jpg`"
                  :alt="game.name"
                  class="w-16 h-9 object-cover rounded"
                  @error="handleImageError"
                />
                <!-- Small quantity badge for list view -->
                <div v-if="game.quantity > 1" class="absolute -top-1 -right-1 bg-blue-500/50 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center text-[10px]">
                  {{ game.quantity }}
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="font-medium text-gray-100" :title="game.name">
                {{ game.name }}
              </div>
            </td>
            <td class="px-4 py-3 text-gray-600 text-right">
              {{ game.steamID }}
            </td>
            <td class="px-4 py-3 text-right">
              <span :class="game.quantity > 1 ? 'text-red-600 font-semibold' : 'text-gray-600'">
                {{ game.quantity }}
              </span>
            </td>
            <td class="px-4 py-3 text-blue-300 text-right">
              {{ game.baseID || '-' }}
            </td>
            <td class="px-4 py-3 text-blue-300 text-right">
                <money :amount="prices?.find(g=>g.steamID==game.steamID)?.historyLow?.m3?.amountInt || 0" />
            </td>
            <td class="px-4 py-3 text-blue-300 text-right">
                <money :amount="prices?.find(g=>g.steamID==game.steamID)?.historyLow?.y1?.amountInt || 0" />
            </td>
            <td class="px-4 py-3 text-blue-300 text-right">
                <money :amount="prices?.find(g=>g.steamID==game.steamID)?.historyLow?.all?.amountInt || 0" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>