<template>
  <NuxtLayout name="main">
    <main>
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
    </main>
    <Modal></Modal>
  </NuxtLayout>
</template>

<script setup lang="ts">
import SearchBar from "~/components/home/SearchBar.vue";
import Modal from "~/components/common/Modal.vue";

const router = useRouter();

const { data, pending, error } = useFetch('/api/fund');

const clickFund = async (address: string) => {
  await router.push(`/fund/${address}`);
}
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