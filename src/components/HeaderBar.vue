<script setup>
import { Twitch, Steam, GamepadVariantOutline, KeyOutline } from 'mdue'
const props = defineProps({
    viewMode: {
        type: String,
        default: 'grid'
    }
})

const emit = defineEmits(['search', 'sort', 'view-change'])

const searchQuery = ref('')
const sortOption = ref('name-asc')
</script>

<template>
    <nav class="custom-cyan-shadow" :title="'zosky\'s steam🔑s'">
        <img src="@/components/logo.png" alt="zoskyCube Logo" />
        <a href="https://twitch.tv/zoskyCube" :title="'ttv:zoskyCube'">
            <Twitch /> 
        </a>
        <Steam />
        <!-- <GamepadVariantOutline /> -->
        <!-- <KeyOutline /> -->
        <section id="stats" />
    </nav>

</template>

<style scoped>
nav { 
    @apply text-2xl font-bold flex items-center gap-2 -mb-7 bg-blue-950 px-3 py-1; 
    filter: drop-shadow(0 10px 15px rgba(6, 182, 212, 0.5));
}
img { @apply h-20 -mt-20 -mb-20 }

</style>