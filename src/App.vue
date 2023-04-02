<template>
  <main class="container mx-auto px-4 py-5">
    <h1 class="text-2xl mb-3">Datatable Demo</h1>
    <data-table :columns="columns" :rows="deals" :search="search" checkable downloadable v-model:checkedRows="checkedRows">
        <template #actions>
          <a role="button" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">See</a>
        </template>
    </data-table>
    <p>Checked rows: {{ checkedRows.length }}</p>
  </main>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { getAllDeals } from './data';
  import { IColumn, IDeal } from './interfaces';
  import DataTable from './components/DataTable.vue';

  const deals = ref<IDeal[]>(getAllDeals());

  const search = ref<string>('');

  const checkedRows = ref<any[]>([]);

  const columns = ref<IColumn[]>([
    {
      field: 'issuer',
      label: 'Issuer',
      sortable: true,
      filterable: true,
      width: '5%',
    },
    {
      field: 'dealName',
      label: 'Deal Name',
      sortable: true,
      filterable: true,
    },
    {
      field: 'industry',
      label: 'Industry',
      sortable: true,
      filterable: true,
    },
    {
      field: 'access',
      label: 'Access',
      sortable: true,
      filterable: true,
    },
    {
      field: 'agent',
      label: 'Agent',
      sortable: true,
      filterable: true,
    },
    {
      field: 'source',
      label: 'Source',
      sortable: true,
      filterable: true,
    },
    {
      field: 'actions',
      label: 'See docs.',
      sortable: false,
    }
  ]);
</script>

<style scoped>

</style>
