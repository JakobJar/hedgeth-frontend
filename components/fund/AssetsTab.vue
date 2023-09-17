<template>
  <h1>Assets</h1>
  <DataTable :value="props.assetValues">
    <Column field="name" header="Name"/>
    <Column field="symbol" header="Symbol"/>
    <Column field="token" header="Token"/>
    <Column header="Value">
      <template #body="slotProps">
        {{ slotProps.data.value / (10n ** BigInt(slotProps.data.decimals)) }}
      </template>
    </Column>
  </DataTable>
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