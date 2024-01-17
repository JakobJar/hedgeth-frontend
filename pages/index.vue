<template>
  <NuxtLayout name="main">
    <main>
      <SearchBar/>
      <p>This app is a prototype, it may have bugs or unfinished features.
      Please use the sepolia test network to make it work properly.</p>
      <FundTable :funds="data"/>
    </main>
  </NuxtLayout>
</template>

<script setup lang="ts">
import SearchBar from "~/components/home/SearchBar.vue";
import FundTable from "~/components/common/FundTable.vue";

useSeoMeta({
  title: 'Home - hedgeth',
});

const { data } = useFetch('/api/fund');
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