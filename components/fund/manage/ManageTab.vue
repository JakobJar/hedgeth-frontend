<template>
  <div class="manage-tab">
    <SwapForm :address="props.address"/>
  </div>
</template>

<script setup lang="ts">
import SwapForm from "~/components/fund/manage/SwapForm.vue";
import MetaForm from "~/components/fund/manage/MetaForm.vue";

const props = defineProps<{
  address: string
}>();
</script>

<style scoped lang="scss">
.manage-tab {
  display: flex;
  align-items: flex-start;
  gap: var(--large-spacing);
  align-self: stretch;
}
</style>
