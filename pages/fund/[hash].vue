<template>
  <NuxtLayout name="main">
    <TabView>
      <TabPanel header="General">
        <div v-if="data && !pending">
          <h1>General</h1>
          <p>Address: <a href="https://sepolia.etherscan.io/address/{{hash}}">{{hash}}</a></p>
          <dl>
            <dt>Owner:</dt>
            <dd v-if="data && !pending"><a href="https://sepolia.etherscan.io/address/{{data.owner}}">{{data.owner}}</a></dd>
            <dt>Fund raising close:</dt>
            <dd>{{data.fundRaisingClose.toLocaleString()}}</dd>
            <dt>Fund close:</dt>
            <dd>{{data.fundClose.toLocaleString()}}</dd>
          </dl>
          <Button label="Invest" @click="invest"/>
          <Button label="Withdraw"/>
        </div>
      </TabPanel>
      <TabPanel header="Assets">
        <div v-if="data && !pending">
          <h1>Assets</h1>
          <DataTable :value="data.assetValues">
            <Column field="key" header="Address"/>
            <Column field="value" header="Value"/>
          </DataTable>
        </div>
      </TabPanel>
      <TabPanel header="Investors">
        <div v-if="data && !pending">
          <h1>Investors</h1>
          <DataTable :value="data.investments">
            <Column field="key" header="Address"/>
            <Column field="value" header="Amount"/>
          </DataTable>
        </div>
      </TabPanel>
      <TabPanel header="Manage">
        <h1>Manage</h1>
        <p>Manage this fund</p>
        <Button label="Manage"/>
      </TabPanel>
    </TabView>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {Contract} from "ethers";

const route = useRoute();

const hash = Array.isArray(route.params.hash) ? route.params.hash[0] : route.params.hash;

const zip = (arr: any[][]) => {
  const a1 = arr[0];
  const a2 = arr[1];
  return a1.map((x, i) => {
    return {
      key: x,
      value: a2[i]
    }
  });
};

const { data, pending } = useAsyncData('load-fund', async () => {
  const ethers = await useEthersProvider();

  const fundABI: [] = await $fetch('/abi/fund.json');

  const fundContract = new Contract(hash, fundABI, ethers.provider);

  return {
    fundRaisingClose: new Date(Number(await fundContract.fundRaisingClose())),
    fundClose: new Date(Number(await fundContract.fundClose())),
    investments: zip(await fundContract.getInvestments()),
    assetValues: zip(await fundContract.getAssetValues()),
    owner: await fundContract.owner()
  };
}, {server: false});

const invest = async () => {
  const signer = await useEthersSigner(true);

  const fundABI: [] = await $fetch('/abi/fund.json');
  const ierc20ABI: [] = await $fetch('/abi/IERC20.json');

  const fundContract = new Contract(hash, fundABI, signer);
  const usdcContract = new Contract('0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5', ierc20ABI, signer);

  const usdcTran = await usdcContract.getFunction('approve').send(hash, 10n ** 18n);
  await usdcTran.wait();
  await fundContract.getFunction('invest').send(10n ** 18n);
};
</script>

<style scoped lang="scss">

</style>