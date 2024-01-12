<template>
  <table>
    <caption>List of investment funds</caption>
    <thead>
    <tr>
      <th>Name</th>
      <th>Current Value</th>
      <th>Manager</th>
      <th>Fundraising Close</th>
      <th>Fund Close</th>
    </tr>
    </thead>
    <tbody v-if="props.funds">
    <tr v-for="fund in funds" :key="fund.address" @click="clickFund(fund.address)" class="selectable">
      <td>{{ fund.name }}</td>
      <td>{{ fund.value?.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) || 'N/A' }}</td>
      <td>{{ fund.manager }}</td>
      <td>{{ new Date(fund.raisingClose).toLocaleString() }}</td>
      <td>{{ new Date(fund.close).toLocaleString() }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
const props = defineProps<{
  funds: {
    name: string,
    address: string,
    value: number | undefined,
    manager: string,
    raisingClose: string,
    close: string,
  }[] | null
}>();

const router = useRouter();

const clickFund = async (address: string) => {
  await router.push(`/fund/${address}`);
}
</script>

<style scoped lang="scss">

</style>