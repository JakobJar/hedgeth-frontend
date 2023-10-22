<template>
  <Menubar :model="menu">
    <template #end>
      <ConnectButton />
    </template>
  </Menubar>
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

<style scoped>

</style>