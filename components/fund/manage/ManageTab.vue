<template>
  <h1>Manage</h1>
  <h3>Swap Assets</h3>
  <SwapForm :address="props.address" />
  <h3>Change meta</h3>
  <MetaForm/>
</template>

<script setup lang="ts">
import SwapForm from "~/components/fund/manage/SwapForm.vue";
import MetaForm from "~/components/fund/manage/MetaForm.vue";

const props = defineProps<{
  address: string
}>();
</script>