<template>
  <Button v-if="!walletAddress" label="Connect Wallet" @click="connectWallet" />
  <span v-else>{{ walletAddress }}</span>
</template>

<script setup lang="ts">
const walletAddress = ref<string | undefined>(undefined);

useCurrentAddress().then(address => {
  walletAddress.value = address;
});

const connectWallet = async () => {
  await useEthersSigner();
  walletAddress.value = await useCurrentAddress();
};
</script>

<style scoped>

</style>