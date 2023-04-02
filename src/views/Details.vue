<template>
  <main class="container mx-auto px-4 py-5">
    <h1 class="text-2xl mb-3">
      <router-link to="/">
        <icon name="chevron-left" />
      </router-link>
      Details
    </h1>
    <data-table :columns="columns" :rows="documents" checkable :downloadable="false" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getDocumentsByDealId } from '../data';
import { IColumn, IDocument } from '../interfaces';
import DataTable from '../components/DataTable.vue';
import Icon from '../components/Icon.vue';

const route = useRoute();

const { id } = route.params;

const documents = ref<IDocument[]>([]);

if (typeof id === 'string') {
  const documentsFiltered: IDocument[] = getDocumentsByDealId(parseInt(id));
  documents.value = documentsFiltered;
}


const columns = ref<IColumn[]>([
    {
      field: 'dealId',
      label: 'Deal Id',
      sortable: true,
      filterable: false,
    },
    {
      field: 'documentName',
      label: 'Document Name',
      sortable: true,
      filterable: false,
    },
    {
      field: 'tag',
      label: 'Tag',
      sortable: true,
      filterable: true,
    },
    {
      field: 'posted',
      label: 'Posted',
      sortable: true,
      filterable: false,
    },
    {
      field: 'lastAccessed',
      label: 'Last Accessed',
      sortable: true,
      filterable: false,
    },
    {
      field: 'note',
      label: 'Note',
      sortable: true,
      filterable: false,
    },
    {
      field: 'filePath',
      label: 'File Path',
      sortable: true,
      filterable: false,
    },
  ]);

</script>

<style scoped>

</style>