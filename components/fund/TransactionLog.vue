<template>
  <h3>Transaction Log</h3>
  <p>WIP</p>
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
  log: [][]
}>();
</script>

<style scoped lang="scss">

</style>