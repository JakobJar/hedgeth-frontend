<template>
  <Button label="Create Fund" severity="success" @click="openDialog = true"/>

  <Dialog v-model:visible="openDialog" modal :draggable="false" header="Create fund" :style="{ width: '50vw' }">
    <form class="create-fund-form">
      <div class="input-group">
        <label for="create-fund-name">Fund name</label>
        <InputText id="create-fund-name" v-model="form.name" size="large" />
      </div>
      <div class="input-group">
        <label for="create-fund-description">Fund description</label>
        <Textarea v-model="form.description" auto-resize />
      </div>
      <div class="input-group-horizontal">
        <div class="input-group">
          <label for="create-fund-raising-close">Fund raising close</label>
          <Calendar id="create-fund-raising-close" v-model="form.fundRaisingClose" show-time :min-date="new Date()" />
        </div>
        <div class="input-group">
          <label for="create-fund-close">Fund close</label>
          <Calendar id="create-fund-close" v-model="form.fundClose" show-time :min-date="fundRaisingClose" />
        </div>
      </div>
      <div class="input-group-horizontal">
        <div class="input-group">
          <label for="create-fund-fee">Investment Fee</label>
          <InputNumber id="create-fund-fee" v-model="form.fee" show-buttons :step="0.25" :min="0" :max="90" suffix="%" />
        </div>
        <div class="input-group">
          <label for="create-fund-performance-fee">Performance Fee</label>
          <InputNumber id="create-fund-performance-fee" v-model="form.performanceFee" show-buttons :step="0.25" :min="0" :max="90" suffix="%" />
        </div>
        <div class="input-group">
          <label for="create-fund-minimum-investment">Minimum Investment</label>
          <InputNumber id="create-fund-minimum-investment" v-model="form.minimumInvestment" show-buttons :min="1" :max="1000" suffix="$" />
        </div>
      </div>
    </form>
    <template #footer>
      <Button label="Create" @click="createFund" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {Contract} from "ethers";

const runtimeConfig = useRuntimeConfig();

const openDialog = ref(false);

const fundRaisingClose = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);
const fundClose = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 14);

const form = reactive({
  name: '',
  description: '',
  fee: 0,
  performanceFee: 0,
  minimumInvestment: 1,
  fundRaisingClose,
  fundClose
});

const createFund = async () => {
  const router = useRouter();
  const signer = await useEthersSigner();

  const fundABI: [] = await $fetch('/abi/factory.json');

  const fundFactoryContract = new Contract(runtimeConfig.public.fundFactoryAddress, fundABI, signer);

  const fundTransaction = await fundFactoryContract.getFunction('createFund').send(
      BigInt(form.minimumInvestment) * 10n ** 18n,
      form.fee * 10 ** 2,
      form.performanceFee * 10 ** 2,
      BigInt(Math.round(form.fundRaisingClose.getTime() / 1000)),
      BigInt(Math.round(form.fundClose.getTime() / 1000)),
  );

  const receipt = await fundTransaction.wait();
  if (receipt && receipt.logs.length >= 3) {
    const fundCreationEvent = receipt.logs[2];
    let fundAddress = fundCreationEvent.topics[1];
    fundAddress = "0x" + BigInt(fundAddress).toString(16);

    const signedMessage = await signer.signMessage(fundAddress);
    const data = {
      name: form.name,
      description: form.description,
      signedMessage
    }
    await $fetch(`/api/fund/${fundAddress}`, {
      method: 'POST',
      body: data,
    });

    await router.push(`/fund/${fundAddress}`);
  }

  openDialog.value = false;
}
</script>

<style scoped lang="scss">
.create-fund-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;

  .input-group {
    display: flex;
    flex-direction: column;
  }

  .input-group-horizontal {
    display: flex;
    gap: 16px;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>