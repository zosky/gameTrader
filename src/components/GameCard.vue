<script setup>
import { Steam } from 'mdue'

const props = defineProps({
  game: {
    type: Object,
    required: true
  },
  price: {
    type: Object,
    required: true
  }
})

const handleImageError = (event) => {
  // Fallback to a placeholder if Steam image fails to load
  event.target.src = `https://via.placeholder.com/460x215/374151/ffffff?text=${encodeURIComponent(props.game.name)}`
}
</script>

<template>
  <div 
    class="rounded-lg hover:shadow-2xl transition-all duration-300 drop-shadow-lg rounded-xl ring-1 ring-blue-800/5-"
    style="filter: drop-shadow(0 10px 6px rgba(0, 165, 255, 0.3));" >
    <!-- Steam Game Image with Overlay -->
    <div class="aspect-video flex items-center justify-center relative rounded-xl">
      <img
        :src="`https://steamcdn-a.akamaihd.net/steam/apps/${game.steamID}/header.jpg`"
        :alt="game.name"
        class="w-full h-full object-fit rounded-xl"
        @error="handleImageError"
      />
      
      <!-- Quantity bubble (only show if quantity > 1) -->
      <div v-if="game.quantity > 1" class="absolute -top-2 -right-2 bg-sky-500/90 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
        {{ game.quantity }}
      </div>
      
      <!-- Base ID badge if exists (moved to top-left to avoid conflict with quantity) -->
      <div v-if="game.baseID" class="absolute top-2 left-2 bg-blue-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded">
        Base: {{ game.baseID }}
      </div>
      
      <!-- Minimal semi-transparent overlay at bottom -->
      <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white px-2 py-1 rounded-b-xl border-t border-sky-400/50 mt-3">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold text-sm truncate flex-1 mr-2" :title="game.name">
            <span v-if="game.quantity > 1" class="font-light text-blue-400/80">{{ game.quantity }}x</span>
            {{ game.name }}
          </h3>
          <a 
            :href="`https://store.steampowered.com/app/${game.steamID}/`" target="steam" rel="noopener"
            :title="`steamID:${game.steamID}`"
            class="flex items-center text-xs text-gray-300 flex-shrink-0">
            {{ game.steamID }}
            <Steam class="w-3 h-3" />
          </a>
          ~<money 
            v-if="price?.historyLow?.all?.amountInt" 
            :amount=price?.historyLow?.all?.amountInt 
            class="hl -mb-1 ml-1" 
            :title="`historicLow: ${price?.historyLow?.all?.amountInt/100}$\nper isThereAnyDeal.com`" />
          <a 
            :href="`https://gg.deals/game/${ game?.name?.toLowerCase()?.replaceAll(' ','-') }`" target="_blank" rel="noopener" 
            :title="`ggDeals:${game.name}`" 
            class="text-xs">
            💰
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.y1 { @apply bg-blue-700/50 px-1 w-full pl-1 }
.m3 { @apply bg-blue-500/50 px-1 w-full pl-1 rounded-t-lg }
.m3:after { content:'3m'; @apply font-light -ml-0.5 opacity-50 }
.y1:after { content:'1y'; @apply font-light -ml-0.5 opacity-50 }
</style>