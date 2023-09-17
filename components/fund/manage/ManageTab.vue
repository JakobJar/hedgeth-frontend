<template>
  <h1>Manage</h1>
  <div>
    <SwapForm />
  </div>
  <Divider layout="vertical" />
  <Button label="Change close" @click="changeCloseDate('setFundClose')"/>
  <Button label="Change fund raising close" @click="changeCloseDate('setFundRaisingClose')"/>
</template>

<script setup lang="ts">
import {Contract} from "ethers";
import SwapForm from "~/components/fund/manage/SwapForm.vue";

const props = defineProps<{
  address: string
}>();

const changeCloseDate = async (method: string) => {
  const signer = await useEthersSigner();

  const fundABI: [] = await $fetch('/abi/fund.json');

  const fundContract = new Contract(props.address, fundABI, signer);

  await fundContract.getFunction(method).send(BigInt(new Date().getTime()) / 1000n + 60n * 10n);
};
</script>

<style scoped>

</style>