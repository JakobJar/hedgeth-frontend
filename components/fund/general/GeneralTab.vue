<template xmlns="http://www.w3.org/1999/html">
  <PriceChart :address="address" />
  <section id="investing">
    <div class="investment-value">
      <span>Your Investment</span>
      <h2>{{ getInvestment.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) }}</h2>
    </div>
    <div class="investment-actions">
      <button @click="investForm.showModal = true">Invest</button>
      <button @click="payout">Payout</button>
    </div>
  </section>
  <section id="metadata">
    <div class="fund-title">
      <h2>{{ props.backendData?.name }}</h2>
      <span>{{ props.address }}</span>
    </div>
    <div class="fund-attributes">
      <div v-if="props.backendData" class="fund-attribute">
        <span class="attribute-name">Manager</span>
        <span class="attribute-value">{{ props.backendData.manager }}</span>
      </div>
      <div v-if="props.blockchainData" class="fund-attribute">
        <span class="attribute-name">AUM</span>
        <span class="attribute-value">{{ (Number(props.blockchainData.aum) / 1e18).toLocaleString(undefined, { style: 'currency', currency: 'USD' }) }}</span>
      </div>
      <div v-if="props.backendData" class="fund-attribute">
        <span class="attribute-name">Management Fee</span>
        <span class="attribute-value">{{ props.backendData.managementFee / 1e2 }}%</span>
      </div>
      <div v-if="props.backendData" class="fund-attribute">
        <span class="attribute-name">Performance Fee</span>
        <span class="attribute-value">{{ props.backendData.performanceFee / 1e2 }}%</span>
      </div>
      <div v-if="props.backendData" class="fund-attribute">
        <span class="attribute-name">Close</span>
        <span class="attribute-value">{{ new Date(props.backendData.raisingClose).toLocaleString() }}</span>
      </div>
      <div v-if="props.backendData" class="fund-attribute">
        <span class="attribute-name">Raising Closed</span>
        <span class="attribute-value">{{ new Date(props.backendData.close).toLocaleString() }}</span>
      </div>
      <div v-if="props.blockchainData" class="fund-attribute">
        <span class="attribute-name">Investors</span>
        <span class="attribute-value">{{ props.blockchainData.investments.length }}</span>
      </div>
      <div v-if="props.blockchainData" class="fund-attribute">
        <span class="attribute-name">Assets</span>
        <span class="attribute-value">{{ props.blockchainData.assetValues.length }}</span>
      </div>
    </div>
  </section>

  <Modal v-if="investForm.showModal" @close="investForm.showModal = false">
    <div class="invest-modal-content">
      <p>Provide the amount of USDC you want to invest into the fund.</p>
      <div class="input-wrapper">
        <input v-model="investForm.amount" type="number" step="0.01" placeholder="Amount in USD" />
      </div>
      <button class="form-button" type="button" @click="invest">Invest</button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import {Contract} from "ethers";
import PriceChart from "~/components/fund/general/PriceChart.vue";
import Modal from "~/components/common/Modal.vue";

const runtimeConfig = useRuntimeConfig();
const props = defineProps<{
  address: string,
  backendData: {
    name: string,
    manager: string,
    close: Date,
    raisingClose: Date,
    performanceFee: number,
    managementFee: number,
  } | null,
  blockchainData: {
    aum: bigint,
    ownInvestment?: bigint,
    investments: any[],
    assetValues: any[],
  } | null,
}>();

const investForm = reactive({
  showModal: false,
  amount: 0.0,
});

const getInvestment = computed(() => {
  const ownInvestment = props.blockchainData?.ownInvestment;
  if (!ownInvestment)
    return 0;
  const ownInvestmentDecimal = Number(ownInvestment) / 1e18;

  const currentValue = props.backendData?.value;
  if (!currentValue)
    return Number(ownInvestment) / 1e18;
  const aumDecimal = (Number(props.blockchainData?.aum) || 0) / 1e18;
  return ownInvestmentDecimal * (Number(currentValue) / Number(aumDecimal));
});

const invest = async () => {
  const signer = await useEthersSigner();

  const fundABI: [] = await $fetch('/abi/ifund.json');
  const ierc20ABI: [] = await $fetch('/abi/ierc20.json');

  const fundContract = new Contract(props.address, fundABI, signer);
  const usdcContract = new Contract(runtimeConfig.public.usdcAddress, ierc20ABI, signer);

  const amount = BigInt(investForm.amount * 10 ** 18);
  const usdcTran = await usdcContract.getFunction('approve').send(props.address, amount);
  await usdcTran.wait();
  await fundContract.getFunction('invest').send(amount);
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
      cursor: pointer;

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

  .fund-attributes {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: var(--small-spacing);
    align-self: stretch;
  }

  .fund-attribute {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    align-items: flex-start;
  }

  .attribute-name {
    color: var(--secondary-color);
    font-weight: 400;
  }

  .attribute-value {
    color: var(--primary-color);
    font-weight: 500;
  }
}

.invest-modal-content {
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: var(--medium-spacing);
}
</style>