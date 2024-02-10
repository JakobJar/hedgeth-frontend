<template>
  <div class="layout">
    <Navbar class="navbar"/>
    <slot/>
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

@media (max-width: 920px) {
  .navbar {
    display: none;
  }
}
</style>