<script setup>
import { Discord } from 'mdue'

const thisYear = new Date().getFullYear()

const copyDiscord = () => {
  // You can replace this with your actual Discord username/handle
  const discordHandle = 'zosky'
  navigator.clipboard.writeText(discordHandle).then(() => {
    // Simple notification - you could enhance this with a toast library
    alert('Discord handle copied to clipboard!')
  }).catch(() => {
    // Fallback for browsers that don't support clipboard API
    prompt('Copy this Discord handle:', discordHandle)
  })
}
</script>

<template>
  <footer class="bg-gray-800 text-white py-4 mt-8">
    <div class="container mx-auto px-6 text-center">
      <p class="text-sm min-w-max flex items-center justify-center gap-1">
        {{thisYear}} © find me on
        <a 
          href="#" 
          class="text-blue-400 hover:text-blue-300 transition-colors"
          @click.prevent="copyDiscord"
        >
          <Discord />
        </a>
      </p>
    </div>
  </footer>
</template>