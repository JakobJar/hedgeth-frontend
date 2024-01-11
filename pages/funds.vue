<template>
  <NuxtLayout name="main">
    <main>
      <button id="create-fund-button" class="form-button" @click="showCreateFundModal = true">Create Fund</button>
      <FundTable :funds="data"/>
    </main>
  </NuxtLayout>
  <CreateFundModal v-if="showCreateFundModal"/>
</template>

<script setup lang="ts">
import CreateFundModal from "~/components/funds/CreateFundModal.vue";
import FundTable from "~/components/common/FundTable.vue";

const showCreateFundModal = ref(false);

const { data } = useAsyncData(async () => {
  const address = await useCurrentAddress();
  return await $fetch(`/api/fund?manager=${address}`);
})
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

#create-fund-button {
  width: auto;
  align-self: flex-end;
}
</style>