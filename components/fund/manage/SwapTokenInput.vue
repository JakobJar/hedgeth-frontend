<template>
  <div class="input-wrapper swap-input-wrapper">
    <input v-model="amount" :placeholder="props.name + ' Amount'" type="number" step="any" required/>
    <button type="button" class="form-button" @click="showModal = true">{{ token?.symbol || 'None' }}</button>

    <Modal v-if="showModal" @close="closeModal">
      <div class="modal-content">
        <label>Search for a token or provide the address for the {{ props.name.toLowerCase() }} token.</label>
        <div class="input-wrapper modal-input-wrapper">
          <input v-model="search" :placeholder="props.name + ' Token Query'" type="text"/>
        </div>
        <div>
          <label>Search results:</label>
          <div class="search-results">
            <div v-if="queriedTokens" v-for="token in queriedTokens" :key="token.address" @click="closeModal(token.address)" class="search-result">
              <p>{{ token.name }} ({{ token.symbol }})</p>
              <span>{{ token.address }}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Modal from "~/components/common/Modal.vue";
import {Contract} from "ethers";

const props = defineProps<{ name: string }>();
const tokenAddress = defineModel<string>('address', {required: true});
const amount = defineModel<number>('amount');

const search = ref('');
const showModal = ref(false);

const closeModal = (address?: string) => {
  showModal.value = false;
  if (address) {
    tokenAddress.value = address;
    refreshToken();
  }
}

const {data: queriedTokens} = useFetch('/api/token', {
  query: {search},
  server: false,
  watch: [search]
});

const {data: token, refresh: refreshToken} = useAsyncData('SwapForm - ' + props.name, async () => {
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

.search-results {
  display: flex;
  flex-direction: column;

  .search-result {
    padding: var(--small-spacing);

    &:hover {
      background-color: var(--background-hover);
      cursor: pointer;
    }
  }
}


</style>