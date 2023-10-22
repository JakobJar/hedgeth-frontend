<template>
  <NuxtLayout name="main">
    <Panel :header="metadata?.name ? metadata.name : 'Loading...'">
      <p v-if="metadata?.description && !metadataPending && !metadataError">{{ metadata.description }}</p>
    </Panel>
    <TabView>
      <TabPanel header="General">
        <div v-if="data && !pending">
          <GeneralTab :owner="data.owner" :fund-close="data.fundClose" :fund-raising-close="data.fundRaisingClose" :address="address" />
        </div>
      </TabPanel>
      <TabPanel header="Assets">
        <div v-if="data && !pending">
          <AssetsTab :asset-values="data.assetValues" />
        </div>
      </TabPanel>
      <TabPanel header="Investors">
        <div v-if="data && !pending">
          <InvestorsTab :investments="data.investments" />
        </div>
      </TabPanel>
      <TabPanel v-if="data?.owner && data?.walletAddress && data?.owner.toUpperCase() === data?.walletAddress.toUpperCase()" header="Manage">
        <ManageTab :address="address" />
      </TabPanel>
    </TabView>
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