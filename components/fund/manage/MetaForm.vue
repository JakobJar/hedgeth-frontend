<template>
  <form id="meta-form">
    <div class="form-input">
      <label for="name">Name</label>
      <InputText v-model="metaForm.name" id="name" />
    </div>
    <div class="form-input">
      <label for="description">Description</label>
      <Textarea v-model="metaForm.description" />
    </div>
    <Button label="Submit" @click="changeMeta"/>
  </form>
</template>

<script setup lang="ts">
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
form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-input {
  display: flex;
  flex-direction: column;
}
</style>