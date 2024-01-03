<template>
  <table>
    <caption>List of all investors of the fund</caption>
    <thead>
    <tr>
      <th>Investor</th>
      <th>Value</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="investment in props.investments" :key="investment.investor">
      <td>{{ investment.investor }}</td>
      <td>{{ (investment.value / (10n ** 18n)).toLocaleString(undefined, { style: 'currency', currency: 'USD' }) }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
const props = defineProps<{
  investments?: {
    investor: string,
    value: bigint,
  }[]
}>();

console.log(props.investments)
</script>

<style scoped>

</style>