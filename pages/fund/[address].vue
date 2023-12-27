<template>
  <NuxtLayout name="main">
    <main>
      <header>
        <div class="value">
          <span>Total Fund Value</span>
          <h1>$2,011.11</h1>
        </div>
        <div class="fund-menu">
          <span>Assets</span>
          <span>Investors</span>
        </div>
      </header>
      <PriceChart address="0x52cb9a25c0edf8b25127f09369320e3bfd475589" />
    </main>
    <section id="transaction-sidebar">
      <h2>Recent Transaction</h2>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {Contract} from "ethers";
import ManageTab from "~/components/fund/manage/ManageTab.vue";
import GeneralTab from "~/components/fund/GeneralTab.vue";
import AssetsTab from "~/components/fund/AssetsTab.vue";
import InvestorsTab from "~/components/fund/InvestorsTab.vue";
import PriceChart from "~/components/fund/PriceChart.vue";

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
main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: var(--large-spacing);
  gap: var(--large-spacing);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
}

.value {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.fund-menu {
  display: flex;
  align-items: center;
  gap: var(--medium-spacing);

  & > span {
    font-size: 0.9rem;
    color: var(--secondary-color);
    padding: var(--small-spacing);
    border-radius: var(--border-radius);
    cursor: pointer;

    &:hover {
      background: var(--background-hover);
    }

    &.selected {
      background: var(--primary-color);
      color: var(--background-color);
    }
  }
}

#transaction-sidebar {
  display: flex;
  width: 350px;
  padding: var(--large-spacing);
  flex-direction: column;
  align-items: flex-start;
  gap: var(--large-spacing);
  flex-shrink: 0;
  align-self: stretch;
}
</style>