<template>
  <div class="modal-backdrop">
    <div class="modal-wrapper">
      <div v-if="!props.hideClose" class="close" @click="emit('close')"></div>
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  hideClose?: boolean
}>();
const emit = defineEmits(['close']);
</script>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-wrapper {
  background: var(--background-color);
  padding: var(--large-spacing);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: var(--border-radius);
}

.close {
  width: 100%;
  text-align: end;
  margin-bottom: var(--small-spacing);

  &:after {
    display: inline-block;
    content: "\00d7";
    font-size: 1.5rem;
  }
}
</style>