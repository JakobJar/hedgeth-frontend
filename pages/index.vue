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
    <Card v-if="data" v-for="fund in data" @click="clickFund(fund.address)">
      <template #title>{{ fund?.name }}</template>
      <template #content>
        <p>{{ fund?.description }}</p>
        <p>{{ fund?.address }}</p>
      </template>
    </Card>
  </NuxtLayout>
</template>

<script setup lang="ts">
const router = useRouter();

const selectedFilter = ref("all");
const filter = ref([
  { name: 'Show all funds', value: 'all' },
  { name: 'Show open funds', value: 'open' },
  { name: 'Show raising funds', value: 'raising' }
]);

const { data, pending, error } = useFetch('/api/fund');

const clickFund = async (address: string) => {
  await router.push(`/fund/${address}`);
}
</script>

<style scoped>

</style>