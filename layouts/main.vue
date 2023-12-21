<template>
  <div class="site">
    <Navbar>

    </Navbar>
    <slot>

    </slot>
  </div>
</template>

<script setup lang="ts">
import Navbar from "~/components/layout/Navbar.vue";
</script>

<style scoped lang="scss">
.site {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  width: 100vw;
  background: var(--background-color);
}
</style>