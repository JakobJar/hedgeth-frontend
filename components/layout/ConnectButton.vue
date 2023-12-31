<template>
  <button id="connect-button" v-if="!walletAddress" @click="connectWallet" type="button">Connect Wallet</button>
  <span v-else>{{ walletAddress }}</span>
</template>

<script setup lang="ts">
const walletAddress = ref<string | undefined>(undefined);

onMounted(async () => {
  walletAddress.value = await useCurrentAddress();
});

const connectWallet = async () => {
  await useEthersSigner();
  walletAddress.value = await useCurrentAddress();
};
</script>

<style scoped lang="scss">
#connect-button {
  display: flex;
  height: 40px;
  width: 100%;
  padding: 0 16px;
  justify-content: center;
  align-items: center;
  gap: var(--small-spacing);

  background-color: var(--background-color);
  border-radius: var(--border-radius);
  border: 1px solid var(--primary-color);
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;

  transition: 0.5s;

  &:hover {
    cursor: pointer;
    color: var(--inverted-primary-color);
    background-color: var(--primary-color);
  }
}

.user-avatar {
  height: 32px;
  width: 32px;
  border-radius: 50%;
}
</style>