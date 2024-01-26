<template>
  <Modal @close="emit('close')">
    <form class="create-fund-form">
      <h3>Create Fund</h3>
      <p>Seize control of your financial destiny — create your own fund!
        Receive management and performance fees from investors as you lead your fund to success.</p>
      <div class="input-group">
        <label for="name">Name</label>
        <div class="input-wrapper">
          <input v-model="formData.name" type="text" id="name" placeholder="Fund name" />
        </div>
      </div>
      <div class="input-group">
        <label for="description">Description</label>
        <div class="input-wrapper">
          <textarea v-model="formData.description" id="description" placeholder="Fund description" />
        </div>
      </div>
      <div class="input-group-horizontal">
        <div class="input-group">
          <label for="fee">Management Fee (percent)</label>
          <div class="input-wrapper">
            <input v-model="formData.fee" type="number" id="fee" step="0.1" placeholder="Management fee" />
          </div>
        </div>
        <div class="input-group">
          <label for="performanceFee">Performance Fee (percent)</label>
          <div class="input-wrapper">
            <input v-model="formData.performanceFee" type="number" id="performanceFee" step="0.1" placeholder="Performance fee" />
          </div>
        </div>
      </div>
      <div class="input-group-horizontal">
        <div class="input-group">
          <label for="fundRaisingClose">Fundraising Close</label>
          <div class="input-wrapper">
            <input v-model="formData.fundRaisingClose" type="datetime-local" id="fundRaisingClose"  />
          </div>
        </div>
        <div class="input-group">
          <label for="fundClose">Fund Close</label>
          <div class="input-wrapper">
            <input v-model="formData.fundClose" type="datetime-local" id="fundClose" />
          </div>
        </div>
      </div>
      <div class="input-group">
        <label for="minimumInvestment">Minimum Investment (USD)</label>
        <div class="input-wrapper">
          <input v-model="formData.minimumInvestment" type="number" id="minimumInvestment" step="0.01" placeholder="Minimum investment" />
        </div>
      </div>
      <button class="form-button" type="button" @click="createFund">Create Fund</button>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import {Contract} from "ethers";
import Modal from "~/components/common/Modal.vue";

const emit = defineEmits(['close']);

const runtimeConfig = useRuntimeConfig();

const fundRaisingClose = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7);
const fundClose = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 14);

const formData = reactive({
  name: '',
  description: '',
  fee: 0,
  performanceFee: 0,
  minimumInvestment: 1,
  fundRaisingClose: fundRaisingClose.toISOString().slice(0, 16),
  fundClose: fundClose.toISOString().slice(0, 16)
});

const createFund = async () => {
  const router = useRouter();
  const signer = await useEthersSigner();

  const fundABI: [] = await $fetch('/abi/ifactory.json');

  const fundFactoryContract = new Contract(runtimeConfig.public.fundFactoryAddress, fundABI, signer);

  const parsedFundRaisingClose = new Date(formData.fundRaisingClose);
  const parsedFundClose = new Date(formData.fundClose);
  const fundTransaction = await fundFactoryContract.getFunction('createFund').send(
      BigInt(formData.minimumInvestment * 10 ** 18),
      formData.fee * 1e2,
      formData.performanceFee * 1e2,
      BigInt(Math.round(parsedFundRaisingClose.getTime() / 1000)),
      BigInt(Math.round(parsedFundClose.getTime() / 1000)),
  );

  const receipt = await fundTransaction.wait();
  console.log(receipt);
  if (!receipt || receipt.logs.length < 1)
    return;

  const fundCreationEvent = receipt.logs[0];
  let fundAddress = fundCreationEvent.topics[1];
  fundAddress = "0x" + BigInt(fundAddress).toString(16);

  const signedMessage = await signer.signMessage(fundAddress);
  const data = {
    name: formData.name,
    description: formData.description,
    signedMessage
  }
  await $fetch(`/api/fund/${fundAddress}`, {
    method: 'POST',
    body: data,
  });

  await router.push(`/fund/${fundAddress}`);
}
</script>

<style scoped lang="scss">
.create-fund-form {
  display: flex;
  width: 500px;
  flex-direction: column;
  justify-content: center;
  gap: var(--medium-spacing);

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 3px;

    & > label {
      font-size: 0.9rem;
      font-weight: 500;
    }
  }

  .input-group-horizontal {
    display: flex;
    gap: var(--medium-spacing);
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>