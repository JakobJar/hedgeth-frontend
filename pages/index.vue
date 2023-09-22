<template>
  <NuxtLayout name="main">
    <Toolbar>
      <template #start>
        <Dropdown label="Show" v-model="selectedFilter" :options="filter" option-label="name"/>
      </template>
      <template #end>
        <Button label="Create Fund" severity="success" @click="createFundDialog = true"/>
      </template>
    </Toolbar>
    <div class="card-list">
      <Card v-if="data" v-for="fund in data" @click="clickFund(fund.address)" class="fund-card">
        <template #title>{{ fund?.name }}</template>
        <template #content>
          <p>{{ fund?.description }}</p>
          <p>{{ fund?.address }}</p>
          <small>{{ fund?.close?.toLocaleString() }} | {{ fund?.raisingClose?.toLocaleString() }}</small>
        </template>
      </Card>
    </div>
  </NuxtLayout>

  <Dialog v-model:visible="createFundDialog" modal header="Create fund" :style="{ width: '50vw' }">
    <p>Enter the name of your fund and a description.</p>
    <form class="create-fund-form">
      <div class="input-group">
        <label for="create-fund-name">Fund name</label>
        <InputText id="create-fund-name" v-model="createFundForm.fundName" size="large" />
      </div>
      <div class="input-group">
        <label for="create-fund-description">Fund description</label>
        <Textarea v-model="createFundForm.fundDescription"/>
      </div>
    </form>
    <template #footer>
      <Button label="Create" @click="createFund" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
const router = useRouter();

const selectedFilter = ref({ name: 'Show all funds', value: 'all' });
const filter = ref([
  { name: 'Show all funds', value: 'all' },
  { name: 'Show open funds', value: 'open' },
  { name: 'Show raising funds', value: 'raising' }
]);
const createFundDialog = ref(false);

const createFundForm = reactive({
  fundName: '',
  fundDescription: ''
});

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

.create-fund-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  .input-group {
    display: flex;
    flex-direction: column;
  }
}
</style>