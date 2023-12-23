<template>
  <div class="layout">
    <Navbar>

    </Navbar>
    <main class="content">
      <slot>

      </slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100vw;
  background: var(--background-color);
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding: var(--large-spacing);
  gap: var(--large-spacing);
}
</style>