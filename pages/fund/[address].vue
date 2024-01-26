<template>
  <NuxtLayout name="main">
    <main>
      <header>
        <div class="value">
          <span>Total Fund Value</span>
          <h1>{{ backendData?.value?.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) || 'N/A' }}</h1>
        </div>
        <div class="fund-menu">
          <button v-if="connectedWallet" :class="{selected: currentTab === 'assets'}" @click="switchTab('assets')">Assets</button>
          <button v-if="connectedWallet" :class="{selected: currentTab === 'investors'}" @click="switchTab('investors')">Investors</button>
          <button v-if="connectedWallet && backendData?.manager.toLowerCase() === connectedWallet" :class="{selected: currentTab === 'manage'}" @click="switchTab('manage')">Manage</button>
        </div>
      </header>
      <GeneralTab v-if="currentTab === 'general'" :address="address" :backend-data="backendData" :blockchain-data="blockchainData"/>
      <AssetsTab v-if="currentTab === 'assets'" :assetValues="blockchainData?.assetValues"/>
      <InvestorsTab v-if="currentTab === 'investors'" :investments="blockchainData?.investments"/>
      <ManageTab v-if="currentTab === 'manage'" :address="address"/>
    </main>
    <section id="transaction-sidebar">
      <TransactionLog :asset-values="[]" :log="[]"/>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {Contract} from "ethers";
import ManageTab from "~/components/fund/manage/ManageTab.vue";
import GeneralTab from "~/components/fund/general/GeneralTab.vue";
import AssetsTab from "~/components/fund/AssetsTab.vue";
import InvestorsTab from "~/components/fund/InvestorsTab.vue";
import TransactionLog from "~/components/fund/TransactionLog.vue";
import {useToast} from "vue-toastification";

useSeoMeta({
  title: 'Fund - hedgeth',
});

const route = useRoute();
const address = Array.isArray(route.params.address) ? route.params.address[0] : route.params.address;

const currentTab = ref('general');
const connectedWallet = ref<string | undefined>(undefined);

onMounted(async () => {
  connectedWallet.value = await useCurrentAddress();

  if (connectedWallet.value)
    return;
  const toast = useToast();
  toast.info("Please connect your wallet for experience the full functionality of this page.");
});

const switchTab = (tab: string) => {
  if (tab === currentTab.value) {
    currentTab.value = 'general';
    return;
  }
  currentTab.value = tab;
};

const { data: blockchainData } = useAsyncData(async () => {
  const provider = await useEthersProvider();
  const currentAddress = await useCurrentAddress();

  const fundABI: [] = await $fetch('/abi/ifund.json');

  const fundContract = new Contract(address, fundABI, provider.provider);

  const investments: any[] = await fundContract.getInvestments();
  let aum = BigInt(0);
  let ownInvestment: bigint | null = null;
  for (const investment of investments) {
    aum += investment.value;
    if (investment.investor.toLowerCase() === currentAddress) {
      ownInvestment = investment.value;
    }
  }

  //const swaps = await fundContract.queryFilter(fundContract.filters.AssetSwap(), 0, 'latest');
  return {
    aum: aum,
    ownInvestment: ownInvestment,
    investments: investments,
    assetValues: await fundContract.getAssetValues(),
    //swaps: swaps.map(swap => (swap instanceof EventLog) ? swap.args : null)
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
  gap: var(--small-spacing);
  flex-shrink: 0;
  align-self: stretch;
}
</style>