<template>
  <NuxtLayout name="main">
    <main>
      <header>
        <div class="value">
          <span>Total Fund Value</span>
          <h1>{{ backendData?.value.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) || 'N/A' }}</h1>
        </div>
        <div class="fund-menu">
          <button v-if="connectedWallet" :class="{selected: currentTab === 'assets'}" @click="switchTab('assets')">Assets</button>
          <button v-if="connectedWallet" :class="{selected: currentTab === 'investors'}" @click="switchTab('investors')">Investors</button>
          <button v-if="connectedWallet && backendData?.manager === connectedWallet" :class="{selected: currentTab === 'manage'}" @click="switchTab('manage')">Manage</button>
        </div>
      </header>
      <GeneralTab v-if="currentTab === 'general'" :address="address" :title="backendData?.name"
                  :investment="blockchainData?.ownInvestment" :aum="blockchainData?.aum"/>
      <AssetsTab v-if="currentTab === 'assets'" :assetValues="blockchainData?.assetValues"/>
      <InvestorsTab v-if="currentTab === 'investors'" :investments="blockchainData?.investments"/>
      <ManageTab v-if="currentTab === 'manage'" :address="address"/>
    </main>
    <section id="transaction-sidebar">
      <h3>Recent Transaction</h3>
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
import MetaForm from "~/components/fund/manage/MetaForm.vue";

const route = useRoute();
const address = Array.isArray(route.params.address) ? route.params.address[0] : route.params.address;

const currentTab = ref('general');
const connectedWallet = ref<string | undefined>(undefined);

onMounted(async () => {
  connectedWallet.value = await useCurrentAddress();
});

const switchTab = (tab: string) => {
  if (tab === currentTab.value) {
    currentTab.value = 'general';
    return;
  }
  currentTab.value = tab;
};

const { data: blockchainData } = useAsyncData(async () => {
  const ethers = await useEthersProvider();
  const currentAddress = await useCurrentAddress();

  const fundABI: [] = await $fetch('/abi/ifund.json');

  const fundContract = new Contract(address, fundABI, ethers.provider);

  const investments: any[] = await fundContract.getInvestments();
  console.log(investments);
  let aum = 0n;
  let ownInvestment: bigint | undefined = undefined;
  for (const investment of investments) {
    aum += investment.value;
    if (investment.investor.toLowerCase() === currentAddress) {
      ownInvestment = investment.value;
    }
  }

  return {
    aum: aum,
    ownInvestment: ownInvestment,
    investments: investments,
    assetValues: await fundContract.getAssetValues(),
  };
}, {server: false});

const { data: backendData } = useFetch(`/api/fund/${address}`);
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

  & > button {
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