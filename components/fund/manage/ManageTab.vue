<template>
  <h1>Manage</h1>
  <h3>Swap Assets</h3>
  <SwapForm :address="props.address" />
  <h3>Change meta</h3>
  <MetaForm/>
</template>

<script setup lang="ts">
import {Contract} from "ethers";
import SwapForm from "~/components/fund/manage/SwapForm.vue";
import MetaForm from "~/components/fund/manage/MetaForm.vue";

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