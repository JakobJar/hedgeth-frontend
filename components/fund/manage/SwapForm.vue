<template>
  <form>
    <div class="form-input">
      <label for="from">From</label>
      <InputText v-model="swapForm.from" id="from"/>
    </div>
    <div class="form-input">
      <label for="to">To</label>
      <InputText v-model="swapForm.to" id="to"/>
    </div>
    <div class="form-input">
      <label for="amount">Amount</label>
      <InputNumber v-model="swapForm.amount" id="amount"/>
    </div>
    <Button label="Swap" @click="swap" />
  </form>
</template>

<script setup lang="ts">
import {Contract} from "ethers";

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

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-input {
  display: flex;
  flex-direction: column;
}
</style>