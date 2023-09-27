<template>
  <h1>Manage</h1>
  <div>
    <SwapForm />
  </div>
  <Button label="Change close" @click="changeCloseDate('setFundClose')"/>
  <Button label="Change fund raising close" @click="changeCloseDate('setFundRaisingClose')"/>
  <form id="meta-form">
    <InputText v-model="metaForm.name" />
    <Textarea v-model="metaForm.description" />
    <Button label="Submit"/>
  </form>
</template>

<script setup lang="ts">
import {Contract} from "ethers";
import SwapForm from "~/components/fund/manage/SwapForm.vue";

const props = defineProps<{
  address: string
}>();

const metaForm = reactive({
  name: '',
  description: ''
});

const changeMeta = async () => {
  const signer = await useEthersSigner();

  const data = {
    name: metaForm.name,
    description: metaForm.description
  }

  await $fetch(`/api/fund/${props.address}`, {
    method: 'POST',
    data: metaForm,
  });
};

const changeCloseDate = async (method: string) => {
  const signer = await useEthersSigner();

  const fundABI: [] = await $fetch('/abi/fund.json');

  const fundContract = new Contract(props.address, fundABI, signer);

  await fundContract.getFunction(method).send(BigInt(new Date().getTime()) / 1000n + 60n * 10n);
};
</script>

<style scoped lang="scss">
#meta-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}
</style>