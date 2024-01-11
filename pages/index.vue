<template>
  <NuxtLayout name="main">
    <main>
      <SearchBar/>
      <FundTable :funds="data"/>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import SearchBar from "~/components/home/SearchBar.vue";
import Modal from "~/components/common/Modal.vue";
import FundTable from "~/components/common/FundTable.vue";

const { data, pending, error } = useFetch('/api/fund');
</script>

<style scoped lang="scss">
main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: var(--large-spacing);
  gap: var(--large-spacing);
}
</style>