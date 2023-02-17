<template>
  <nav class="menu animated overlay-navigation" aria-label="navigation">
    <div style="position: relative">
      <div
        class="menu-item d-flex flex-items-center"
        @click="router.push('/idol')"
      >
        <i-ic-baseline-person class="mr-2" />
        アイドル一覧
      </div>
      <div
        class="menu-item d-flex flex-items-center"
        @click="router.push('/group')"
      >
        <i-ic-baseline-groups class="mr-2" />
        グループ一覧
      </div>
      <div
        class="menu-item d-flex flex-items-center"
        @click="router.push('/ranking')"
      >
        <i-ic-baseline-align-horizontal-left class="mr-2" />
        ランキング
      </div>
      <div
        class="menu-item d-flex flex-items-center"
        @click="router.push('/history')"
      >
        <i-ic-round-history-edu class="mr-2" />
        履歴
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const router = useRouter()

const subMenu = ref<boolean>(false)
</script>

<style scoped>
.animated {
  animation-name: fade-in;
  animation-duration: 0.15s;
  animation-timing-function: ease-in-out;
}

.overlay-navigation {
  z-index: 30;
  height: 100%;
  width: 100%;
  padding-bottom: 65px;
  position: fixed;
  overflow-y: auto;
}
</style>
