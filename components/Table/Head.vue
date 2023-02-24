<script setup lang="ts">
import { debounce } from '@antfu/utils'
const props = defineProps({
  table: {
    type: Object,
    default: null,
  },
})

const globalSearch = debounce(250, (event: Event) => {
  props.table.setGlobalFilter((event.target as any).value)
})

const totalPages = computed(() => props.table.getPageCount())
const randomView = () => {
  props.table.setPageIndex(Math.floor(Math.random() * totalPages.value) + 1)
}
randomView()
</script>

<template>
  <div class="mb-2">
    <input class="form-control input-lg" type="text" placeholder="検索" @input="(event:Event) => globalSearch(event)" />
    <button class="btn ml-3" type="button" @click="randomView">ランダム表示</button>
  </div>
</template>
