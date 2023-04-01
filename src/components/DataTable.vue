<template>
  <div class="data-table-wrapper">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th v-if="selectable" class="p-4">
							<div class="flex items-center">
								<input id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
								<label for="checkbox-all-search" class="sr-only">checkbox</label>
							</div>
						</th>
          <th
            v-for="(column, index) in columns"
            :key="index"
            class="px-6 py-3"
            :class="column.className"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in rowsFiltered" :key="rowIndex" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <td v-for="(column, columnIndex) in columns" :key="columnIndex" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
            <slot :name="column.field" v-bind="{row, index: rowIndex}">
              {{ row[column.field] }}
            </slot>
          </td>
        </tr>
        <tr v-if="rows.length===0">
          <td class="text-sm text-slate-500 font-medium px-6 whitespace-nowrap text-center" :colspan="columns.length">
            <slot name="no-data">
              {{noDataText}}
            </slot>
          </td>
        </tr>
        <tr v-else-if="rowsFiltered.length===0">
          <td class="text-sm text-slate-500 font-medium px-6 whitespace-nowrap text-center" :colspan="columns.length">
            No matches for '{{ search }}'
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IColumn } from '../interfaces';

const props = defineProps({
  columns: {
    type: Array<IColumn>,
    required: true,
  },
  rows: {
    type: Array<any>,
    required: true,
  },
  checkedRows: {
    type: Array<any>,
    default: () => [],
  },
  valueField: {
    type: String,
    default: 'id'
  },
  downloadable: {
    type: Boolean,
    default: false,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  search: {
    type: String,
    default: '',
  },
  noDataText: {
    type: String,
    default: 'No data available',
  }
});

const rowsClone = ref<any[]>([]);


rowsClone.value = [...props.rows] || [];

const rowsFiltered = computed(() => {
  if (props.search.length) {
    const items = rowsClone.value.filter(r => {
      const values = Object.values(r);
      return values.some(v => v?.toString().toLowerCase().includes(props.search.toLowerCase()) || false);
    });
    return items;
  }
  return rowsClone.value;
});


</script>