<template>
  <Menubar :model="menu">

  </Menubar>
</template>

<script setup lang="ts">
import {MenuItem} from "primevue/menuitem";

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