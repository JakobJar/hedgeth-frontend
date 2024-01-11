<template>
  <h1>Hallo</h1>
</template>

<script setup lang="ts">
import {ethers} from "ethers";

const props = defineProps<{
  address: string,
}>();

const { data } = useAsyncData(async () => {
  const provider = await useEthersProvider();

  const eventLog = await provider.getLogs({
    address: props.address,
    fromBlock: 0,
    toBlock: 'latest',
    topics: [
      ethers.id('AssetSwap(address,uint256,address,uint256)'),
    ]
  });

  console.log(eventLog);
  return eventLog;
}, {server: false});
</script>

<style scoped lang="scss">

</style>