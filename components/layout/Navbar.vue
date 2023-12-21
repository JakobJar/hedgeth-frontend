<template>
  <nav>
    <div class="logo-placeholder"></div>
    <div class="menu">
      <div class="menu-item selected">
        <span>Home</span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {MenuItem} from "primevue/menuitem";
import ConnectButton from "~/components/layout/ConnectButton.vue";

const menu: MenuItem[] = [
  {
    label: "Home",
    icon: "pi pi-fw pi-home",
    to: "/"
  }
]
</script>

<style scoped lang="scss">
nav {
  display: flex;
  width: 300px;
  height: 100%;
  padding: 32px;
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
  gap: 16px;
  align-self: stretch;

  .menu-item {
    display: flex;
    padding: 16px 32px;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    border-radius: 3px;

    &.selected {
      background: linear-gradient(90deg, #FF6E7F 0%, #BFE9FF 100%);
    }
  }
}

.logo-placeholder {
  height: 51px;
  align-self: stretch;
  background: #D9D9D9;
}
</style>