<template>
  <bottom-interactive-tooltip>
    <button class="p-2 w-8 h-8 hover:bg-gray-300 rounded-full shadow-sm mx-2">
      <icon name="funnel" />
    </button>
    <template #content>
      <input type="search" v-model="search" placeholder="Search..." class="p-1 border-gray-200 border rounded-md"/>
      <div class="px-1 flex flex-col items-container mt-1">
        <label v-for="(item, index) in uniqueItems" :key="index" class="cursor-pointer my-1">
          <input v-model="visibleColumns" :value="item" type="checkbox" />
          {{ item }}
        </label>
      </div>
    </template>
  </bottom-interactive-tooltip>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import Icon from './Icon.vue';
import BottomInteractiveTooltip from './BottomInteractiveTooltip.vue';

const emit = defineEmits(['update:value']);

const props = defineProps({
  value: {
    type: Array<String|string>,
    default: () => [],
  },
  items: {
    type: Array<String|string>,
    required: true,
  }
});


const visibleColumns = ref<string[]>([]);

const search = ref('');

const uniqueItems = computed(() => {
  const uniqItems = [...new Set(props.items.filter((r) => !!r))];
  if (search.value) {
    return uniqItems.filter((r) => r.toLowerCase().includes(search.value.toLowerCase()));
  }
  return uniqItems;
});


watch(visibleColumns, (val) => {
  emit('update:value', val);
});


</script>

<style scoped>
  .items-container {
    max-height: 150px;
    overflow-y: scroll;
  }

  .items-container::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .items-container::-webkit-scrollbar-track {
    border-radius: 10px;
    background: rgba(0,0,0,0.1);
  }

  .items-container::-webkit-scrollbar-thumb{
    border-radius: 10px;
    background: rgba(0,0,0,0.2);
  }

  .items-container::-webkit-scrollbar-thumb:hover{
  	background: rgba(0,0,0,0.4);
  }

  .items-container::-webkit-scrollbar-thumb:active{
  	background: rgba(0,0,0,.9);
  }
</style>