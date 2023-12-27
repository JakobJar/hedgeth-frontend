<template>

</template>

<script setup lang="ts">
import {Contract} from "ethers";

const props = defineProps<{
  address: string,
  owner: string,
  fundRaisingClose: Date,
  fundClose: Date,
}>();

const runtimeConfig = useRuntimeConfig();

const invest = async () => {
  const signer = await useEthersSigner();

  const fundABI: [] = await $fetch('/abi/fund.json');
  const ierc20ABI: [] = await $fetch('/abi/ierc20.json');

  const fundContract = new Contract(props.address, fundABI, signer);
  const usdcContract = new Contract(runtimeConfig.public.usdcAddress, ierc20ABI, signer);

  const usdcTran = await usdcContract.getFunction('approve').send(props.address, 10n ** 19n);
  await usdcTran.wait();
  await fundContract.getFunction('invest').send(10n ** 19n);
};

const payout = async () => {
  const signer = await useEthersSigner();

  const fundABI: [] = await $fetch('/abi/fund.json');

  const fundContract = new Contract(props.address, fundABI, signer);
  await fundContract.getFunction('payout').send();
};
</script>

<style scoped>

</style>