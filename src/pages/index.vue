<script setup>
import { GamepadVariantOutline, KeyOutline, Cash } from 'mdue'

const theD = ref([])
const priceData = ref([])
const processedGames = ref([])
const filteredGames = ref([])
const viewMode = ref('grid')
const searchQuery = ref('')
const sortOption = ref('name-asc')

fetch('/gamelist.json')
    .then(res => res.json())
    .then(data => { 
        theD.value = data
        processedGames.value = processGamesWithQuantity(data)
        filteredGames.value = processedGames.value
        applySorting()
    })
fetch('/priceData.json')
    .then(res => res.json())
    .then(data => { priceData.value = data })

const processGamesWithQuantity = (games) => {
    const gameMap = new Map()
    
    games.forEach(game => {
        // For games with the same steamID, group them together regardless of name variations
        const existingGame = Array.from(gameMap.values()).find(g => g.steamID === game.steamID)
        
        if (existingGame) {
            // Found a game with the same steamID, increment quantity
            existingGame.quantity += 1
        } else {
            // New game, add to map
            gameMap.set(game.steamID, {
                ...game,
                quantity: 1
            })
        }
    })
    
    return Array.from(gameMap.values())
}

const handleSearch = (query) => {
    searchQuery.value = query
    applyFilters()
}

const handleSort = (option) => {
    sortOption.value = option
    applySorting()
}

const handleViewChange = (mode) => {
    viewMode.value = mode
}

const applyFilters = () => {
    let filtered = processedGames.value

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(game => 
            game.name.toLowerCase().includes(query)
        )
    }

    filteredGames.value = filtered
    applySorting()
}

const applySorting = () => {
    const sorted = [...filteredGames.value]
    
    // Helper function to get price value for a game
    const getPriceValue = (game, priceType) => {
        const priceInfo = priceData.value.find(p => p.steamID === game.steamID)
        if (!priceInfo?.historyLow) return 0
        
        switch (priceType) {
            case 'm3': return priceInfo.historyLow.m3?.amountInt || 0
            case 'y1': return priceInfo.historyLow.y1?.amountInt || 0
            case 'all': return priceInfo.historyLow.all?.amountInt || 0
            default: return 0
        }
    }
    
    if (sortOption.value === 'name-asc') {
        sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOption.value === 'name-desc') {
        sorted.sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortOption.value === 'price3m-asc') {
        sorted.sort((a, b) => getPriceValue(a, 'm3') - getPriceValue(b, 'm3'))
    } else if (sortOption.value === 'price3m-desc') {
        sorted.sort((a, b) => getPriceValue(b, 'm3') - getPriceValue(a, 'm3'))
    } else if (sortOption.value === 'price1y-asc') {
        sorted.sort((a, b) => getPriceValue(a, 'y1') - getPriceValue(b, 'y1'))
    } else if (sortOption.value === 'price1y-desc') {
        sorted.sort((a, b) => getPriceValue(b, 'y1') - getPriceValue(a, 'y1'))
    } else if (sortOption.value === 'priceAll-asc') {
        sorted.sort((a, b) => getPriceValue(a, 'all') - getPriceValue(b, 'all'))
    } else if (sortOption.value === 'priceAll-desc') {
        sorted.sort((a, b) => getPriceValue(b, 'all') - getPriceValue(a, 'all'))
    }
    
    filteredGames.value = sorted
}

// Computed stats for teleport
const uniqueGameCount = computed(() => processedGames.value.length)
const totalQuantity = computed(() => processedGames.value.reduce((sum, game) => sum + game.quantity, 0))
const estimatedValue = computed(() => {
    return processedGames.value.reduce((sum, game) => {
        const priceInfo = priceData.value.find(p => p.steamID === game.steamID)
        const lowestPrice = priceInfo?.historyLow?.all?.amountInt || 0
        return sum + (lowestPrice * game.quantity)
    }, 0)
})

// Format currency value (assuming amountInt is in cents)
const formatCurrency = (amountInt) => {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD'
    }).format(amountInt / 100)
}
</script>

<template>
    <section>
        <!-- Teleport stats to HeaderBar -->
        <Teleport to="#stats">
            <div class="flex items-center gap-2 text-sm">
                <span class="flex flex-row items-center text-cyan-300" title="gameCount">
                    {{ uniqueGameCount }}
                    <GamepadVariantOutline />
                </span>
                <span class="flex flex-row items-center text-green-300" title="keyCount">
                    {{ totalQuantity }}
                    <KeyOutline />
                </span>
                <span class="flex flex-row items-center text-yellow-300" title="estimatedValue">
                    <!-- {{ formatCurrency(estimatedValue) }} -->
                    ~<money :amount="estimatedValue" />
                    <Cash class="-ml-1" />
                </span>
            </div>
        </Teleport>

        <GameHeader 
            :view-mode="viewMode"
            @search="handleSearch"
            @sort="handleSort"
            @view-change="handleViewChange"
        />
        
        <div class="container mx-auto py-2 px-6">
            <!-- <h1 class="text-xl font-bold mb-3 text-blue-600/50">
                {{ filteredGames?.length }}🎮 {{ filteredGames.reduce((sum, game) => sum + game.quantity, 0) }}🔑
            </h1> -->
            
            <!-- Grid View -->
            <div 
                v-if="viewMode === 'grid'" 
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-2"
            >
                <GameCard 
                    v-for="game in filteredGames" 
                    :key="`${game.steamID}-${game.name}`"
                    :game="game" 
                    :price="priceData.find(p => p.steamID === game.steamID) ?? {}"
                />
            </div>
            
            <!-- List View -->
            <GameList 
                v-else 
                :games="filteredGames" 
                :prices="priceData"
            />
        </div>
    </section>
</template>
