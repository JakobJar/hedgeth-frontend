<template>
  <div class="input-wrapper swap-input-wrapper">
    <input v-model="amount" :placeholder="props.name + ' Amount'" type="number" step="any" required />
    <button type="button" class="form-button" @click="showModal = true">{{ token?.symbol || 'None' }}</button>

    <Modal v-if="showModal">
      <div class="modal-content">
        <label>Provide the address of the {{ props.name }} token</label>
        <div class="input-wrapper modal-input-wrapper">
          <input v-model="tokenAddress" :placeholder="props.name + ' Token Address'" type="text" required />
        </div>
        <button class="form-button" type="button" @click="closeModal">Close</button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Modal from "~/components/common/Modal.vue";
import {Contract} from "ethers";

const props = defineProps<{name: string}>();
const tokenAddress = defineModel<string>('address', { required: true });
const amount = defineModel<number>('amount');

const showModal = ref(false);

const closeModal = () => {
  showModal.value = false;
  refreshToken();
}

const { data: token, refresh: refreshToken } = useAsyncData('SwapForm - ' + props.name, async () => {
  const provider = await useEthersProvider();
  const ierc20Metadata: [] = await $fetch('/abi/ierc20metadata.json');

  let symbol = null;
  try {
    const tokenContract = new Contract(tokenAddress.value, ierc20Metadata, provider);
    symbol = await tokenContract.symbol();
  } catch (e) {
    console.debug(e);
  }
  return {symbol};
}, {server: false});
</script>

<style scoped lang="scss">
.swap-input-wrapper {
  justify-content: space-between;
  gap: var(--small-spacing);

  & > button {
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