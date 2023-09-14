<template>
  <NuxtLayout name="main">
    <TabView>
      <TabPanel header="General">
        <div v-if="data && !pending">
          <h1>General</h1>
          <p>Address: <a href="https://sepolia.etherscan.io/address/{{address}}">{{ address }}</a></p>
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
            <Column field="name" header="Name"/>
            <Column field="symbol" header="Symbol"/>
            <Column field="token" header="Token"/>
            <Column header="Value">
              <template #body="slotProps">
                {{slotProps.data.value / (10n ** BigInt(slotProps.data.decimals))}}
              </template>
            </Column>
          </DataTable>
        </div>
      </TabPanel>
      <TabPanel header="Investors">
        <div v-if="data && !pending">
          <h1>Investors</h1>
          <DataTable :value="data.investments">
            <Column field="investor" header="Address"/>
            <Column header="Investment">
              <template #body="slotProps">
                {{slotProps.data.value / (10n ** 18n)}}
              </template>
            </Column>
          </DataTable>
        </div>
      </TabPanel>
      <TabPanel header="Manage">
        <h1>Manage</h1>
        <form>
          <label for="from">From</label>
          <InputText v-model="from" id="from"/>
          <label for="to">To</label>
          <InputText v-model="to" id="to"/>
          <label for="amount">Amount</label>
          <InputNumber v-model="amount" id="amount"/>
          <Button label="Swap" @click="swap" />
          <Button label="Create pool" @click="createPool" />
        </form>
        <Button label="Change close" @click="changeCloseDate('setFundClose')"/>
        <Button label="Change fund raising close" @click="changeCloseDate('setFundRaisingClose')"/>
      </TabPanel>
    </TabView>
  </NuxtLayout>
</template>

<script setup lang="ts">
import {Contract} from "ethers";

const route = useRoute();

const address = Array.isArray(route.params.address) ? route.params.address[0] : route.params.address;

const from = ref('');
const to = ref('');
const amount = ref(0);

const { data, pending } = useAsyncData('load-fund', async () => {
  const ethers = await useEthersProvider();

  const fundABI: [] = await $fetch('/abi/fund.json');

  const fundContract = new Contract(address, fundABI, ethers.provider);

  return {
    fundRaisingClose: new Date(Number(await fundContract.fundRaisingClose()) * 1000),
    fundClose: new Date(Number(await fundContract.fundClose()) * 1000),
    investments: await fundContract.getInvestments(),
    assetValues: await fundContract.getAssetValues(),
    owner: await fundContract.owner()
  };
}, {server: false});

const invest = async () => {
  const signer = await useEthersSigner(true);

  const fundABI: [] = await $fetch('/abi/fund.json');
  const ierc20ABI: [] = await $fetch('/abi/IERC20.json');

  const fundContract = new Contract(address, fundABI, signer);
  const usdcContract = new Contract('0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5', ierc20ABI, signer);

  const usdcTran = await usdcContract.getFunction('approve').send(address, 10n ** 18n);
  await usdcTran.wait();
  await fundContract.getFunction('invest').send(10n ** 18n);
};

const swap = async () => {
  console.log("swap");
  const signer = await useEthersSigner(true);

  const fundABI: [] = await $fetch('/abi/fund.json');

  const fundContract = new Contract(address, fundABI, signer);
  console.log("swap", from.value, to.value, amount.value);
  await fundContract.getFunction('swapAssets').send(from.value, to.value, BigInt(amount.value) * 10n ** 18n);
};

const changeCloseDate = async (method: string) => {
  const signer = await useEthersSigner(true);

  const fundABI: [] = await $fetch('/abi/fund.json');

  const fundContract = new Contract(address, fundABI, signer);

  await fundContract.getFunction(method).send(BigInt(new Date().getTime()) / 1000n + 60n * 10n);
};
</script>

<style scoped lang="scss">

</style>