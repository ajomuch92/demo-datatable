<template>
  <div class="relative inline-block" v-click-outside="() => show=false">
    <button class="p-2 bg-gray-100 hover:bg-gray-300 rounded-md shadow-sm mx-2" @click="show=!show">
      Columns
      <icon name="columns" />
    </button>
    <span ref="refContainer" v-show="show" class="absolute bg-white shadow-md rounded-md min-w-max p-4 border border-gray-100 selector">
      <p class="font-bold">{{ label }}</p>
      <div class="px-1 flex flex-col">
        <label v-for="(column, index) in columns" :key="index" class="cursor-pointer">
          <input v-model="visibleColumns" :value="column.field" type="checkbox" />
          {{ column. label}}
        </label>
      </div>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { IColumn } from '../interfaces';
import Icon from './Icon.vue';

const emit = defineEmits(['on-visible-columns']);

const props = defineProps({
  columns: {
    type: Array<IColumn>,
    required: true,
  },
  label: {
    type: String,
    default: 'Select the columns you want to show'
  },
});

const refContainer = ref(undefined);

const containerHeight = ref(0);

const visibleColumns = ref<string[]>([]);

const show = ref(false);

const bottomOffset = computed(() => `-${containerHeight.value + 10}px`);

watch(show, (val: Boolean) => {
  if (val) {
    updateOffset();
  }
});

watch(visibleColumns, (val: any[]) => {
  emit('on-visible-columns', val);
});

function updateOffset() {
  nextTick(() => {
    const el = refContainer.value;
    containerHeight.value = (el as any)?.clientHeight || 0;
  });
}

visibleColumns.value = props.columns.map((r) => r.field) || [];
</script>

<style scoped>
  .selector {
    bottom: v-bind(bottomOffset);
    left: 50%;
    transform: translateX(-50%);
  }
</style>