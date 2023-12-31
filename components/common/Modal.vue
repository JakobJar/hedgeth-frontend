<template>
  <div class="modal-backdrop">
    <div class="modal-wrapper">
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
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
</style>