<template>
  <Html :data-color-mode="themeStore.theme" data-light-theme="light" data-dark-theme="dark">
    <Body>
      <TheHeader />

      <main>
        <container class="pt-3 pb-3">
          <slot />
        </container>
      </main>

      <TheFooter />
    </Body>
  </Html>
</template>

<script setup lang="ts">
import { useThemeStore } from '~~/stores/theme'

const themeStore = useThemeStore()
</script>

<style>
table {
  caret-color: transparent;
}
</style>
