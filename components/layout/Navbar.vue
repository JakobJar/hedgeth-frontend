<template>
  <nav>
    <img src="/logo.svg" class="logo" alt="Logo">
    <div class="menu">
      <NuxtLink v-for="item in menuItems" :key="item.name" :to="item.link" class="menu-item" :class="{selected: route.fullPath === item.link}">
        {{ item.name }}
      </NuxtLink>
    </div>
    <ConnectButton />
  </nav>
</template>

<script setup lang="ts">
import ConnectButton from "~/components/layout/ConnectButton.vue";

const menuItems = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'My Investments',
    link: '/investments',
  },
  {
    name: 'My Funds',
    link: '/funds',
  },
  {
    name: 'FAQ',
    link: '/faq',
  },
];

const route = useRoute();
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
  overflow: hidden;

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
    color: var(--primary-color);
    text-decoration: none;

    &:hover {
      background: var(--background-hover);
      cursor: pointer;
    }

    &.selected {
      background: linear-gradient(90deg, #0a5aa6bb 0%, #8c0086bb 100%);
      color: #FFFFFF;
      font-weight: 500;
    }
  }
}

.logo {
  height: 75px;
  align-self: center;
}
</style>