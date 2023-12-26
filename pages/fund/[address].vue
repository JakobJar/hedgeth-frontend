<template>
  <NuxtLayout name="main">
    
  </NuxtLayout>
</template>

<script setup lang="ts">
import {Contract} from "ethers";
import ManageTab from "~/components/fund/manage/ManageTab.vue";
import GeneralTab from "~/components/fund/GeneralTab.vue";
import AssetsTab from "~/components/fund/AssetsTab.vue";
import InvestorsTab from "~/components/fund/InvestorsTab.vue";

const route = useRoute();

const address = Array.isArray(route.params.address) ? route.params.address[0] : route.params.address;

const { data, pending } = useAsyncData(async () => {
  const ethers = await useEthersProvider();

  const fundABI: [] = await $fetch('/abi/fund.json');

  const fundContract = new Contract(address, fundABI, ethers.provider);

  return {
    fundRaisingClose: new Date(Number(await fundContract.fundRaisingClose()) * 1000),
    fundClose: new Date(Number(await fundContract.fundClose()) * 1000),
    investments: await fundContract.getInvestments(),
    assetValues: await fundContract.getAssetValues(),
    owner: await fundContract.owner(),
    walletAddress: await useCurrentAddress(),
  };
}, {server: false});

const { data: metadata, pending: metadataPending, error: metadataError } = useFetch(`/api/fund/${address}`);
</script>

<style scoped lang="scss">

</style>