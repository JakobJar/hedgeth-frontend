<template>
  <form>
    <label for="from">From</label>
    <InputText v-model="swapForm.from" id="from"/>
    <label for="to">To</label>
    <InputText v-model="swapForm.to" id="to"/>
    <label for="amount">Amount</label>
    <InputNumber v-model="swapForm.amount" id="amount"/>
    <Button label="Swap" @click="swap" />
  </form>
</template>

<script setup lang="ts">
import {Contract} from "ethers";
import {AlphaRouter} from "@uniswap/smart-order-router";
import {ChainId} from "@uniswap/sdk-core";

const props = defineProps<{
  address: string
}>();

const swapForm = reactive({
  from: '',
  to: '',
  amount: 0,
});

const swap = async () => {
  const signer = await useEthersSigner();

  const fundABI: [] = await $fetch('/abi/fund.json');

  const fundContract = new Contract(props.address, fundABI, signer);
  await fundContract.getFunction('swapAssets').send(swapForm.from, swapForm.to, BigInt(swapForm.amount) * 10n ** 18n);
};
</script>

<style scoped>

</style>