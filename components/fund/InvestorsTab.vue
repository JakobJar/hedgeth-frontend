<template>
  <h1>Investors</h1>
  <DataTable :value="props.investments">
    <Column field="investor" header="Address"/>
    <Column header="Investment">
      <template #body="slotProps">
        {{ slotProps.data.value / (10n ** 18n) }}
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
const props = defineProps<{
  investments: {
    investor: string,
    value: bigint,
  }[]
}>();
</script>

<style scoped>

</style>