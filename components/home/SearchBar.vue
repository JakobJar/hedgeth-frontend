<template>
  <div class="search-bar">
    <!-- TODO: Add icon -->
    <input type="text" placeholder="Search for a fund..." />
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.search-bar {
  display: flex;
  padding: 16px;
  align-items: center;
  gap: 8px;
  align-self: stretch;

  border-radius: var(--border-radius);
  border: 1px solid var(--primary-color);

  & > input {
    flex: 1;
    padding: 0;

    border: none;
    outline: none;
    background: transparent;
    color: var(--primary-color);
    font-family: "Inter", sans-serif;
    font-weight: 300;
    font-size: 1rem;
  }
}
</style>