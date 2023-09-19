<template>
  <NuxtLayout name="main">
    <Toolbar>
      <template #start>
        <Dropdown label="Show" v-model="selectedFilter" :options="filter" option-label="name"/>
      </template>
      <template #end>
        <Button label="Create Fund" severity="success"/>
      </template>
    </Toolbar>
  </NuxtLayout>
</template>

<script setup lang="ts">
const selectedFilter = ref();
const filter = ref([
  { name: 'Show all funds', value: 'all' },
  { name: 'Show open funds', value: 'open' },
  { name: 'Show raising funds', value: 'raising' }
]);
</script>

<style scoped>

</style>