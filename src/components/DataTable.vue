<template>
  <div class="data-table-wrapper">
    <section class="flex justify-between mb-3">
      <input v-if="searchable" type="search" v-model="search" placeholder="Search..." class="py-1 px-2 border-gray-200 border rounded-md"/>
      <div>
        <button class="p-2 bg-blue-600 hover:bg-blue-800 text-white rounded-md shadow-sm mx-2" @click="downloadContent">
          Download
        </button>
      </div>
    </section>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th v-if="checkable" class="p-4">
							<div class="flex items-center">
								<input v-model="allChecked" id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
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
          <td v-if="checkable" class="w-4 p-4">
            <div class="flex items-center">
              <input :value="row[valueField]" v-model="checked" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
            </div>
          </td>
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
import { ref, computed, watch } from 'vue';
import { IColumn } from '../interfaces';

const emit = defineEmits(['update:checkedRows']);

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
  downloadType: {
    type: String,
    default: 'all',
    validator: (val: string) => ['all', 'filtered'].includes(val)
  },
  checkable: {
    type: Boolean,
    default: false,
  },
  noDataText: {
    type: String,
    default: 'No data available',
  },
  searchable: {
    type: Boolean,
    default: true,
  }
});

const rowsClone = ref<any[]>([]);

const search = ref<string>('');

const checked = ref<string[]|number[]>([]);

const allChecked = ref(false);


rowsClone.value = [...props.rows] || [];

watch(allChecked, (val: Boolean) => {
  checked.value = val ? rowsClone.value.map((r) => r[props.valueField]) : [];
});

watch(checked, () => {
  const itemsToEmit = [...rowsClone.value.filter((r) => checked.value.includes(r[props.valueField] as any))];
  emit('update:checkedRows', itemsToEmit);
});

const rowsFiltered = computed(() => {
  if (search.value.length) {
    const items = rowsClone.value.filter(r => {
      const values = Object.values(r);
      return values.some(v => v?.toString().toLowerCase().includes(search.value.toLowerCase()) || false);
    });
    return items;
  }
  return rowsClone.value;
});

function downloadContent(){
  let csv = '';
  csv += props.columns.map((r) => r.field).join(', ');
  csv += '\n';
  const items = props.downloadType === 'all' ? rowsClone.value : rowsFiltered.value;
  for(const item of items) {
    csv += Object.values(item).join(', ');
    csv += '\n';
  }
  const csvFile = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const downloadLink = document.createElement('a');
  downloadLink.download = `data-table-content-${Date.now()}.csv`;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}


</script>