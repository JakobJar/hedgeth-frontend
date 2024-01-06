<template>
  <form id="swap-form">
    <h3>Swap Assets</h3>
    <div class="input-wrapper swap-input-wrapper">
      <input v-model="swapForm.amount" placeholder="Amount in" type="number" step="any" required />
      <button type="button" class="form-button" @click="swapForm.showFromTokenModal = true">{{ swapTokens?.fromToken.symbol || 'None' }}</button>
    </div>
    <div class="input-wrapper swap-input-wrapper">
      <input v-model="swapForm.minimumAmountOut" placeholder="Minimum amount out" type="number" step="any" />
      <button type="button" class="form-button" @click="swapForm.showToTokenModal = true">{{ swapTokens?.toToken.symbol || 'None' }}</button>
    </div>
    <!-- TODO: preview costs -->
    <button class="form-button" type="button" @click="swap">Swap</button>
  </form>
  <Modal v-if="swapForm.showFromTokenModal">
    <div class="modal-content">
      <label>Provide the address of the input token</label>
      <div class="input-wrapper modal-input-wrapper">
        <input v-model="swapForm.fromToken" placeholder="Input Token Address" type="text" required />
      </div>
      <button class="form-button" type="button" @click="closeModal">Close</button>
    </div>
  </Modal>
  <Modal v-if="swapForm.showToTokenModal">
    <div class="modal-content">
      <label>Provide the address of the output token</label>
      <div class="input-wrapper modal-input-wrapper">
        <input v-model="swapForm.toToken" placeholder="Output Token Address" type="text" required />
      </div>
      <button class="form-button" type="button" @click="closeModal">Close</button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import {Contract, ethers} from "ethers";
import Modal from "~/components/common/Modal.vue";

const props = defineProps<{
  address: string
}>();
const runtimeConfig = useRuntimeConfig();

const swapForm = reactive({
  from: '',
  fromToken: runtimeConfig.public.usdcAddress,
  to: '',
  toToken: '',
  amount: undefined,
  minimumAmountOut: undefined,
  showFromTokenModal: false,
  showToTokenModal: false,
});

const { data: swapTokens, refresh: refreshSwapTokens } = useAsyncData(async () => {
  const provider = await useEthersProvider();
  const ierc20Metadata: [] = await $fetch('/abi/ierc20metadata.json');

  let fromSymbol = undefined;
  try {
    const fromTokenContract = new Contract(swapForm.fromToken, ierc20Metadata, provider);
    fromSymbol = await fromTokenContract.symbol();
  } catch (e) {
    console.debug(e);
  }

  let toSymbol = undefined;
  try {
    const toTokenContract = new Contract(swapForm.toToken, ierc20Metadata, provider);
    toSymbol = await toTokenContract.symbol();
  } catch (e) {
    console.debug(e);
  }
  return {
    fromToken: {symbol: fromSymbol},
    toToken: {symbol: toSymbol}
  };
}, {server: false});

const closeModal = () => {
  swapForm.showFromTokenModal = false;
  swapForm.showToTokenModal = false;
  refreshSwapTokens();
};

const getAmounts = async () => {
  const signer = await useEthersSigner();

  const ierc20Metadata: [] = await $fetch('/abi/ierc20metadata.json');

  const fromTokenContract = new Contract(swapForm.fromToken, ierc20Metadata, signer);
  const toTokenContract = new Contract(swapForm.toToken, ierc20Metadata, signer);

  const fromTokenDecimals = await fromTokenContract.decimals();
  const toTokenDecimals = await toTokenContract.decimals();

  const amountIn = BigInt(swapForm.amount! * 10 ** fromTokenDecimals);
  const minAmountOut = BigInt((swapForm.minimumAmountOut ?? 0) * 10 ** toTokenDecimals);
  return {amountIn, minAmountOut, fromTokenDecimals, toTokenDecimals};
}

const loadRoute = async (amountIn: BigInt, fromTokenDecimals: BigInt, toTokenDecimals: BigInt) => {
  const routerRequestBody = {
    "amount": amountIn,
    "tradeType": 0,
    "currencyAmount": {
      "address": swapForm.from,
      "decimals": fromTokenDecimals,
    },
    "currency": {
      "address": swapForm.to,
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
  await fundContract.getFunction('swapAssets').send(encodedPath, amountIn, minAmountOut);
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

.swap-input-wrapper {
  justify-content: space-between;
  gap: var(--small-spacing);

  button {
    height: 25px;
    width: auto;
    padding: 0 var(--small-spacing);

    font-weight: 400;
    font-size: 0.8rem;
  }
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: var(--small-spacing);
}

.modal-input-wrapper {
  width: 500px;
}
</style>