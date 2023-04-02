<template>
  <bottom-interactive-tooltip>
    <button class="p-2 bg-gray-100 hover:bg-gray-300 rounded-md shadow-sm mx-2">
      Columns
      <icon name="columns" />
    </button>
    <template #content>
      <p class="font-bold">{{ label }}</p>
      <div class="px-1 flex flex-col">
        <label v-for="(column, index) in columns" :key="index" class="cursor-pointer">
          <input v-model="visibleColumns" :value="column.field" type="checkbox" />
          {{ column. label}}
        </label>
      </div>
    </template>
  </bottom-interactive-tooltip>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { IColumn } from '../interfaces';
import Icon from './Icon.vue';
import BottomInteractiveTooltip from './BottomInteractiveTooltip.vue';

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


const visibleColumns = ref<string[]>([]);


watch(visibleColumns, (val: any[]) => {
  emit('on-visible-columns', val);
});

visibleColumns.value = props.columns.map((r) => r.field) || [];
</script>

<style scoped>
</style>