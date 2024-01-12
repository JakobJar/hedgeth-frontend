<template>
  <table>
    <caption>List of all assets the fund owns</caption>
    <thead>
    <tr>
      <th>Name</th>
      <th>Symbol</th>
      <th>Token</th>
      <th>Value</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="asset in props.assetValues" :key="asset.token">
      <td>{{ asset.name }}</td>
      <td>{{ asset.symbol }}</td>
      <td>{{ asset.token }}</td>
      <td>{{ Number(asset.value) / (10 ** Number(asset.decimals)) }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
const props = defineProps<{
  assetValues: {
    name: string,
    symbol: string,
    token: string,
    value: bigint,
    decimals: number,
  }[],
}>();
</script>

<style scoped>

</style>