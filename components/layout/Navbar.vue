<template>
  <nav>
    <div class="logo-placeholder"></div>
    <div class="menu">
      <button class="menu-item selected">Home</button>
      <button class="menu-item">My Investments</button>
      <button class="menu-item">My Funds</button>
      <button class="menu-item">FAQ</button>
    </div>
    <ConnectButton />
  </nav>
</template>

<script setup lang="ts">
import ConnectButton from "~/components/layout/ConnectButton.vue";
</script>

<style scoped lang="scss">
nav {
  display: flex;
  width: calc(320px - 2 * var(--large-spacing));
  height: calc(100vh - 2 * var(--large-spacing));
  padding: var(--large-spacing);
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
  align-self: stretch;

  background: var(--background-color);
}

.menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--medium-spacing);
  align-self: stretch;

  .menu-item {
    display: flex;
    padding: var(--medium-spacing) var(--large-spacing);
    align-items: center;
    gap: var(--small-spacing);
    align-self: stretch;
    border-radius: var(--border-radius);

    &:hover {
      background: var(--background-hover);
      cursor: pointer;
    }

    &.selected {
      background: linear-gradient(90deg, #FF6E7F 0%, #BFE9FF 100%);
      color: #FFFFFF;
      font-weight: 500;
    }
  }
}

.logo-placeholder {
  height: 51px;
  align-self: stretch;
  background: #D9D9D9;
}
</style>