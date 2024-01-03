<template xmlns="http://www.w3.org/1999/html">
  <PriceChart :address="address" />
  <section id="investing">
    <div class="investment-value">
      <span>Your Investment</span>
      <h2>{{(props.investment ? props.investment / 10n ** 18n : 0n).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}}</h2>
    </div>
    <div class="investment-actions">
      <button @click="invest">Invest</button>
      <button @click="payout">Payout</button>
    </div>
  </section>
  <section id="metadata">
    <div class="fund-title">
      <h2>{{ props.title }}</h2>
      <span>{{ props.address }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import {Contract} from "ethers";
import PriceChart from "~/components/fund/PriceChart.vue";
import {options} from "kolorist";

const runtimeConfig = useRuntimeConfig();
const props = defineProps<{
  address: string,
  title?: string,
  investment?: bigint,
  aum?: bigint,
}>();

const invest = async () => {
  const signer = await useEthersSigner();

  const fundABI: [] = await $fetch('/abi/ifund.json');
  const ierc20ABI: [] = await $fetch('/abi/ierc20.json');

  const fundContract = new Contract(props.address, fundABI, signer);
  const usdcContract = new Contract(runtimeConfig.public.usdcAddress, ierc20ABI, signer);

  const usdcTran = await usdcContract.getFunction('approve').send(props.address, 10n ** 19n);
  await usdcTran.wait();
  await fundContract.getFunction('invest').send(10n ** 19n);
};

const payout = async () => {
  const signer = await useEthersSigner();

  const fundABI: [] = await $fetch('/abi/ifund.json');

  const fundContract = new Contract(props.address, fundABI, signer);
  await fundContract.getFunction('payout').send();
};
</script>

<style scoped lang="scss">
#investing {
  display: flex;
  padding: var(--medium-spacing);
  justify-content: space-between;
  align-items: flex-end;
  align-self: stretch;

  border-radius: var(--border-radius);
  background: var(--primary-color);

  .investment-value {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--small-spacing);

    & > span {
      color: var(--inverted-secondary-color);
    }

    & > h2 {
      color: var(--inverted-primary-color);
    }
  }

  .investment-actions {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    gap: var(--small-spacing);

    & > button {
      display: flex;
      padding: var(--small-spacing);
      justify-content: center;
      align-items: center;
      gap: var(--small-spacing);

      border-radius: var(--border-radius);
      border: 1px solid var(--inverted-primary-color);
      background: var(--primary-color);
      color: var(--inverted-primary-color);
      font-size: 0.9rem;

      &:hover {
        background: var(--inverted-primary-color);
        color: var(--primary-color);
      }
    }
  }
}

#metadata {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--medium-spacing);
  align-self: stretch;

  .fund-title {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
  }
}
</style>