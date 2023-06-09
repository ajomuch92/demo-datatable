<template>
  <div class="data-table-wrapper">
    <section class="flex justify-between mb-3">
      <input v-if="searchable" type="search" v-model="search" placeholder="Search..." class="py-1 px-2 border-gray-200 border rounded-md"/>
      <div>
        <column-selector v-if="showColumnSelector" :columns="columns" @on-visible-columns="visibleColumns=$event" />
        <button v-if="downloadable" class="p-2 bg-blue-600 hover:bg-blue-800 text-white rounded-md shadow-sm mx-2" @click="downloadContent">
          Download
          <icon name="download" />
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
            v-for="(column, index) in columnsFiltered"
            :key="index"
            class="px-6 py-3"
            :class="column.headerClass"
          >
            <column-filter v-if="column.filterable" v-model:value="filters[column.field]" :items="getFilterValuesByColumn(column.field)" />
            <span :class="{'cursor-pointer select-none': column.sortable}" @click="setSortOrder(column)">
              {{ column.label }}
              <icon v-if="sortField.field===column.field" class="text-gray-500 text-base" :name="sortField.order==='DESC'? 'arrow-down-short':'arrow-up-short'" />
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in rowsFiltered"
          :key="rowIndex"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          v-show="rowVisibility(rowIndex+1)"
        >
          <td v-if="checkable" class="w-4 p-4">
            <div class="flex items-center">
              <input :value="row[valueField]" v-model="checked" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer">
            </div>
          </td>
          <td
            v-for="(column, columnIndex) in columnsFiltered"
            :key="columnIndex"
            class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
            :class="column.cellClass"
            :style="{width: column.width || 'auto'}"
          >
            <slot :name="column.field" v-bind="{row, index: rowIndex}">
              {{ row[column.field] }}
            </slot>
          </td>
        </tr>
        <tr v-if="rows.length===0">
          <td class="text-sm text-slate-500 font-medium px-6 whitespace-nowrap text-center" :colspan="columns.length+(checkable? 1: 0)">
            <slot name="no-data">
              {{noDataText}}
            </slot>
          </td>
        </tr>
        <tr v-else-if="rowsFiltered.length===0&&search.length">
          <td class="text-sm text-slate-500 font-medium px-6 whitespace-nowrap text-center" :colspan="columns.length+(checkable? 1: 0)">
            No matches for '{{ search }}'
          </td>
        </tr>
        <tr v-else-if="rowsFiltered.length===0&&search.length===0">
          <td class="text-sm text-slate-500 font-medium px-6 whitespace-nowrap text-center" :colspan="columns.length+(checkable? 1: 0)">
            No matches for these filters
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-center justify-end mt-2">
      <label>Rows per page:</label>
      <select v-model.number="rowsPerPage" class="border border-gray-300 mx-2 p-1 rounded-md">
        <option v-for="(option, key) in rowsPerPageArr" :key="key" :value="option">{{ option }}</option>
      </select>
      <pagination :total-pages="totalPages" @on-active-page="activePage=$event" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { IColumn } from '../interfaces';
import ColumnSelector from './ColumnSelector.vue';
import Icon from './Icon.vue';
import Pagination from './Pagination.vue';
import ColumnFilter from './ColumnFilter.vue';

interface ISort {
  field?: string;
  order?: 'DESC' | 'ASC';
}

type Filter = {[key: string]: any[]}

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
  },
  showColumnSelector: {
    type: Boolean,
    default: true,
  },
  rowsPerPageArr: {
    type: Array<Number | number>,
    default: () => [5, 10, 25, 50]
  }
});

const rowsClone = ref<any[]>([]);

const search = ref<string>('');

const checked = ref<any[]>([]);

const allChecked = ref(false);

const visibleColumns = ref<any[]>([]);

rowsClone.value = [...props.rows] || [];

const rowsPerPage = ref(props.rowsPerPageArr[0]);
const activePage = ref(1);

const sortField = ref<ISort>({});

const filters = ref<Filter>({});

watch(allChecked, (val: Boolean) => {
  checked.value = val ? rowsClone.value.map((r) => r[props.valueField]) : [];
});

watch(checked, () => {
  const itemsToEmit = [...rowsClone.value.filter((r) => checked.value.includes(r[props.valueField]))];
  emit('update:checkedRows', itemsToEmit);
});

const rowsFiltered = computed(() => {
  let items: any[] = [];
  if (search.value.length) {
    items = rowsClone.value.filter(r => {
      const values = Object.values(r);
      return values.some(v => v?.toString().toLowerCase().includes(search.value.toLowerCase()) || false);
    });
  } else {
    items = rowsClone.value;
  }
  if (Object.keys(sortField).length > 0) {
    items = sortRows(items);
  }
  const keysFilter = Object.keys(filters.value);
  for (let i = 0; i < keysFilter.length; i += 1) {
    const key: string = keysFilter[i];
    const valueArr: string[] = filters.value[key];
    if (valueArr.length) {
      items = items.filter((r) => valueArr.includes(r[key]))
    }
  }
  return items;
});

const columnsFiltered = computed(() => {
  if (visibleColumns.value.length) {
    return props.columns.filter((r) => visibleColumns.value.includes(r.field));
  }
  return props.columns;
});

const totalPages = computed(() => Math.ceil(rowsFiltered.value.length / (rowsPerPage.value as number)) || 1);

function downloadContent(){
  let csv = '';
  csv += props.columns.map((r) => r.label).join(', ');
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

function rowVisibility(index: Number): Boolean {
  const rowsPerPageVal = (rowsPerPage.value as number);
  const last: Number = activePage.value * rowsPerPageVal;
  const first: Number = (last as number) - rowsPerPageVal + 1
  return index >= first && index <= last;
}

function setSortOrder(column: IColumn) {
  const { field, sortable } = column;
  if (sortable) {
    if (sortField.value.field !== field) {
      sortField.value = {
        field,
        order: 'DESC',
      }
    } else if (sortField.value.field === field && sortField.value.order === 'DESC') {
      sortField.value = {
        field,
        order: 'ASC',
      }
    } else {
      sortField.value = {};
    }
  }
}

function sortRows(arr: any[]): any[] {
  const { field, order } = sortField.value;
  return arr.sort((a, b) => {
    let comparison = 0;
    const valA = a[field || ''];
    const valB = b[field || ''];

    if (valA > valB) {
      comparison = 1;
    } else if (valA < valB) {
      comparison = -1;
    }

    return order === 'DESC' ? comparison * -1 : comparison;
  });
}

function getFilterValuesByColumn(field: string): string[] {
  const rows = rowsClone.value;
  const values: string[] = rows.map((r) => `${r[field]}`);
  return values;
}

function setFiltersArr() {
  filters.value = props.columns.map((r) => r.field).reduce((prev, curr) => ({...prev, [curr]: []}), {});
}

setFiltersArr();

</script>