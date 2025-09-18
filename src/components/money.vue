<script setup>
const props = defineProps({
  amount: {
    type: Number,
    required: true,
    default: 0
  }
})

const dollars = computed(() => {
  const totalCents = Math.abs(props.amount)
  return Math.floor(totalCents / 100)
})

const cents = computed(() => {
  const totalCents = Math.abs(props.amount)
  return (totalCents % 100).toString().padStart(2, '0')
})
</script>

<template>
  <span class="inline-flex items-baseline">
    <span class="font-bold text-xs">{{ dollars }}</span>
    <span class="underline scale-75 origin-left font-light -mt-2">{{ cents }}</span>
  </span>
</template>