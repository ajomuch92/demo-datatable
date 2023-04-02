<template>
  <div class="relative inline-block" v-click-outside="() => show=false">
    <button class="p-2 w-8 h-8 hover:bg-gray-300 rounded-full shadow-sm mx-2" @click="show=!show">
      <icon name="funnel" />
    </button>
    <span ref="refContainer" v-show="show" class="absolute bg-white shadow-md rounded-md min-w-max p-4 border border-gray-100 filter">
      <input type="search" v-model="search" placeholder="Search..." class="p-1 border-gray-200 border rounded-md"/>
      <div class="px-1 flex flex-col items-container mt-1">
        <label v-for="(item, index) in uniqueItems" :key="index" class="cursor-pointer my-1">
          <input v-model="visibleColumns" :value="item" type="checkbox" />
          {{ item }}
        </label>
      </div>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import Icon from './Icon.vue';

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

const refContainer = ref(undefined);

const containerHeight = ref(0);

const visibleColumns = ref<string[]>([]);

const show = ref(false);

const search = ref('');

const bottomOffset = computed(() => `-${containerHeight.value + 10}px`);

const uniqueItems = computed(() => {
  const uniqItems = [...new Set(props.items.filter((r) => !!r))];
  if (search.value) {
    return uniqItems.filter((r) => r.toLowerCase().includes(search.value.toLowerCase()));
  }
  return uniqItems;
});

watch(show, (val: Boolean) => {
  if (val) {
    updateOffset();
  }
});

watch(visibleColumns, (val) => {
  emit('update:value', val);
  updateOffset();
});


function updateOffset() {
  nextTick(() => {
    const el = refContainer.value;
    containerHeight.value = (el as any)?.clientHeight || 0;
  });
}

</script>

<style scoped>
  .filter {
    bottom: v-bind(bottomOffset);
    left: 50%;
    transform: translateX(-50%);
    min-width: 150px;
  }

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