<template>
  <i class="bi" :class="`bi-${name}`"></i>
</template>

<script setup lang="ts">
  defineProps({
    name: {
      type: String,
      required: true,
      validator: (val: string) => !val.includes('bi')
    }
  })
</script>

<style>

</style>