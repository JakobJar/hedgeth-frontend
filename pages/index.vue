<template>
  <NuxtLayout name="main">
    <h1>Hallo</h1>
  </NuxtLayout>
</template>

<script setup lang="ts">
import CreateFundButton from "~/components/home/CreateFundButton.vue";

const router = useRouter();

const selectedFilter = ref({ name: 'Show all funds', value: 'all' });
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

<style scoped lang="scss">
.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  padding: 16px 0;
}

.fund-card {
  cursor: pointer;
  width: 32%;
  min-width: 200px;
  border: 3px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(to left, rgba(0, 200, 83, 0.5), rgba(178, 255, 89, 0.5));
  transition: 0.5s;

  &:hover {
    border-image-source: linear-gradient(to right, rgba(0, 200, 83, 0.5), rgba(178, 255, 89, 0.5));
  }
}
</style>