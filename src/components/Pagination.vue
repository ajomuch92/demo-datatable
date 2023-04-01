<template>
  <nav aria-label="Page navigation" class="flex my-1">
    <button class="flex items-center justify-center w-8 h-8 text-indigo-600 transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100 disabled:opacity-50" :disabled="currentPage===1" @click="currentPage-=1">
      <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
    </button>
    <span>
      <input v-model="currentPage" type="number" class="p-1 border border-gray-300 rounded-md mr-1 text-center" @input="inputHandler" />
      <span>/ {{ totalPages }}</span>
    </span>
    <button class="flex items-center justify-center w-8 h-8 text-indigo-600 transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100 disabled:opacity-50" :disabled="currentPage===totalPages" @click="currentPage+=1">
      <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
    </button>
  </nav>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const emit = defineEmits(['on-active-page']);

  const props = defineProps({
    totalPages: {
      type: Number,
      default: 1,
      validator: (val: number) => val > 0
    }
  });

  const currentPage = ref(1);

  watch(currentPage, (val: number) => {
    emit('on-active-page', val);
  });

  function inputHandler(event: Event | any) {
    const { data } = event;
    const { value } = event.target;
    if (data === '.') {
      event.preventDefault();
      currentPage.value = parseInt(currentPage.value.toString());
      return;
    }
    if (value) {
      const numberValue = parseInt(value);
      if (numberValue < 1) {
        event.preventDefault();
        currentPage.value = 1;
        return;
      } else if (numberValue > props.totalPages) {
        event.preventDefault();
        currentPage.value = props.totalPages;
        return;
      }
    } else {
      currentPage.value = 1;
      event.preventDefault();
      return;
    }
  }
</script>

<style scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input {
    max-width: 50px;
    -moz-appearance: textfield;
  }
</style>