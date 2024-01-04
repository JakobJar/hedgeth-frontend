<template>
  <form id="meta-form">
    <h3>Change Metadata</h3>
    <div class="input-wrapper">
      <input v-model="metaForm.name" placeholder="Fund Name"/>
    </div>
    <div class="input-wrapper textarea-wrapper">
      <textarea v-model="metaForm.description" placeholder="Fund Description"/>
    </div>
    <button class="form-button" @click="changeMeta">Submit</button>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  address: string
}>();

const metaForm = reactive({
  name: '',
  description: ''
});

const changeMeta = async () => {
  const signer = await useEthersSigner();

  const signedMessage = await signer.signMessage(props.address);

  const data = {
    name: metaForm.name,
    description: metaForm.description,
    signedMessage
  }

  await $fetch(`/api/fund/${props.address}`, {
    method: 'POST',
    body: data,
  });
};
</script>

<style scoped lang="scss">
#meta-form {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 16px;
}

.textarea-wrapper {
  height: 100%;
  padding: var(--small-spacing);

  textarea {
    border: none;
    width: 100%;
    height: 62px;
    resize: vertical;

    font-size: 0.9rem;
    font-family: "Inter", sans-serif;

    &:focus {
      outline: none;
    }
  }
}
</style>