<template>
  <form id="swap-form">
    <h3>Swap Assets</h3>
    <SwapTokenInput v-model:address="swapForm.fromToken" v-model:amount="swapForm.amount" name="Input"/>
    <SwapTokenInput v-model:address="swapForm.toToken" v-model:amount="swapForm.minimumAmountOut" name="Minimum Output"/>
    <!-- TODO: preview costs -->
    <button class="form-button" type="button" @click="swap">Swap</button>
  </form>
</template>

<script setup lang="ts">
import {Contract, ethers} from "ethers";
import SwapTokenInput from "~/components/fund/manage/SwapTokenInput.vue";

const props = defineProps<{
  address: string
}>();
const runtimeConfig = useRuntimeConfig();

const swapForm = reactive({
  fromToken: runtimeConfig.public.usdcAddress,
  toToken: '',
  amount: undefined,
  minimumAmountOut: undefined,
});

const getAmounts = async () => {
  const signer = await useEthersSigner();

  const ierc20Metadata: [] = await $fetch('/abi/ierc20metadata.json');

  const fromTokenContract = new Contract(swapForm.fromToken, ierc20Metadata, signer);
  const toTokenContract = new Contract(swapForm.toToken, ierc20Metadata, signer);

  const fromTokenDecimals = await fromTokenContract.decimals();
  const toTokenDecimals = await toTokenContract.decimals();

  const amountIn = BigInt(swapForm.amount! * 10 ** Number(fromTokenDecimals));
  const minAmountOut = BigInt((swapForm.minimumAmountOut ?? 0) * 10 ** Number(toTokenDecimals));
  return {amountIn, minAmountOut, fromTokenDecimals, toTokenDecimals};
}

const loadRoute = async (amountIn: BigInt, fromTokenDecimals: BigInt, toTokenDecimals: BigInt) => {
  const routerRequestBody = {
    "amount": amountIn,
    "tradeType": 0,
    "currencyAmount": {
      "address": swapForm.fromToken,
      "decimals": fromTokenDecimals,
    },
    "currency": {
      "address": swapForm.toToken,
      "decimals": toTokenDecimals,
    }
  }
  return await $fetch(runtimeConfig.public.smartRouterUrl + '/route', {
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
}

const swap = async () => {
  if (!swapForm.fromToken || !swapForm.toToken)
    return;
  const signer = await useEthersSigner();

  const fundABI: [] = await $fetch('/abi/ifund.json');

  const {amountIn, minAmountOut, fromTokenDecimals, toTokenDecimals} = (await getAmounts())!;
  const routerResult: any = await loadRoute(amountIn, fromTokenDecimals, toTokenDecimals);

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
  await fundContract.getFunction('swapAssets').send(encodedPath, amountIn, minAmountOut, swapForm.fromToken, swapForm.toToken);
};
</script>

<style scoped lang="scss">
#swap-form {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--medium-spacing);
}
</style>