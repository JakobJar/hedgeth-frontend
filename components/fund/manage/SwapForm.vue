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
import {Contract, ethers} from "ethers";

const props = defineProps<{
  address: string
}>();

const runtimeConfig = useRuntimeConfig();

const swapForm = reactive({
  from: '',
  to: '',
  amount: 0,
});

const swap = async () => {
  const signer = await useEthersSigner();

  const fundABI: [] = await $fetch('/abi/fund.json');

  // TODO: load decimals
  const amountIn = BigInt(swapForm.amount) * 10n ** 18n;
  const minAmountOut = 0n;
  const routerRequestBody = {
    "amount": amountIn,
    "tradeType": 0,
    "currencyAmount": {
      "address": swapForm.from,
      "decimals": 18,
    },
    "currency": {
      "address": swapForm.to,
      "decimals": 18,
    }
  }

  const routerResult: any = await $fetch(runtimeConfig.public.smartRouterUrl + '/route', {
    method: 'POST',
    body: JSON.stringify(routerRequestBody, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value
    ),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const route = routerResult.route[0];
  const encodeTypes: string[] = [];
  const encodeValues: any[] = [];
  for (let i = 0; i < route.tokenPath.length; i++) {
    const token = route.tokenPath[i];
    if (i > 0) {
      encodeTypes.push('uint24');
      encodeValues.push(route.route.pools[i - 1].fee);
    }
    encodeTypes.push('address');
    encodeValues.push(token.address);
  }
  const encodedPath = ethers.solidityPacked(encodeTypes, encodeValues);

  const fundContract = new Contract(props.address, fundABI, signer);
  await fundContract.getFunction('swapAssets').send(encodedPath, amountIn, minAmountOut);
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