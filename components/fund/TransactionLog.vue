<template>
  <h3>Transaction Log</h3>
  <div id="transactions">
    <div v-if="props.log" v-for="entry in props.log" class="transaction">
      <p>
        {{ Number(entry.args[1]) / 10 ** Number(tokens[entry.args[0]].decimals)}}
        <abbr :title="entry.args[0]">{{ tokens[entry.args[0]].symbol }}</abbr> =>
        {{ Number(entry.args[3]) / 10 ** Number(tokens[entry.args[2]].decimals)}}
        <abbr :title="entry.args[2]">{{ tokens[entry.args[2]].symbol }}</abbr>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {EventLog} from "ethers";

const props = defineProps<{
  assetValues: {
    name: string,
    symbol: string,
    token: string,
    value: bigint,
    decimals: number,
  }[],
  log: EventLog[]
}>();

const tokens = Object.fromEntries(props.assetValues.map(asset => [asset.token, asset]));
</script>

<style scoped lang="scss">
#transactions {
  display: flex;
  flex-direction: column;
  gap: var(--medium-spacing);
}

.transaction {
  display: flex;
  flex-direction: column;
}
</style>