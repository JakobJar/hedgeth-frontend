<template>
  <NuxtLayout name="main">
    <SearchBar/>
    <table>
      <caption>List of all investment funds</caption>
      <thead>
        <tr>
          <th>Name</th>
          <th>Performance</th>
          <th><abbr title="Assets under Management">AUM</abbr></th>
          <th>Manager</th>
          <th>Fundraising Close</th>
          <th>Fund Close</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fund in data" :key="fund.address" @click="clickFund(fund.address)" class="selectable">
          <td>{{ fund.name }}</td>
          <td>TODO</td>
          <td>TODO</td>
          <td>{{ fund.manager }}</td>
          <td>{{ new Date(fund.raisingClose!).toLocaleString() }}</td>
          <td>{{ new Date(fund.close!).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </NuxtLayout>
</template>

<script setup lang="ts">
import CreateFundButton from "~/components/home/CreateFundButton.vue";
import SearchBar from "~/components/home/SearchBar.vue";

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