<script setup lang="ts">
const props = defineProps({
  table: {
    type: Object,
    default: null,
  },
})

const options = [10, 20, 50, 100]
let perPage = ref(0)
window.innerHeight < 1080 ? (perPage = ref(10)) : (perPage = ref(20))
props.table.setPageSize(perPage.value)

const currentPage = (page: number) => {
  return props.table.getState().pagination.pageIndex === page
}

const changePerPage = () => {
  props.table.setPageSize(perPage.value)
}
</script>

<template>
  <!-- ページネーション -->
  <nav class="paginate-container" aria-label="Pagination">
    <div class="pagination">
      <a
        class="previous_page"
        :aria-disabled="!table.getCanPreviousPage()"
        @click="table.getCanPreviousPage() ? table.previousPage() : null"
        >前</a
      >
      <template
        v-if="
          table.getState().pagination.pageIndex >= 3 &&
          table.getState().pagination.pageIndex <= table.getPageCount() - 4
        "
      >
        <!-- 最初の3ページ、最後の3ページの以外のときの表示 -->
        <a :aria-label="`Page 1`" :aria-current="currentPage(0)" @click="table.setPageIndex(0)">{{ 1 }}</a>
        <span v-if="table.getState().pagination.pageIndex !== 3" class="gap">…</span>
        <div v-for="i in 4" :key="i">
          <a
            :aria-label="`Page ${table.getState().pagination.pageIndex + i - 2}`"
            :aria-current="currentPage(table.getState().pagination.pageIndex + i - 3)"
            @click="table.setPageIndex(table.getState().pagination.pageIndex + i - 3)"
            >{{ table.getState().pagination.pageIndex + i - 2 }}</a
          >
        </div>
        <span class="gap">…</span>
        <a
          :aria-label="'Page ' + table.getPageCount()"
          :aria-current="currentPage(table.getPageCount() - 1)"
          @click="table.setPageIndex(table.getPageCount() - 1)"
          >{{ table.getPageCount() }}</a
        >
      </template>
      <template v-else>
        <!-- 最初の3ページ、最後の3ページのときの表示 -->
        <div v-for="i in 3" :key="i">
          <a :aria-label="`Page ${i}`" :aria-current="currentPage(i - 1)" @click="table.setPageIndex(i - 1)">{{ i }}</a>
        </div>
        <span class="gap">…</span>
        <div v-for="(offset, index) in [2, 1, 0]" :key="index">
          <a
            :aria-label="'Page ' + (table.getPageCount() - offset)"
            :aria-current="currentPage(table.getPageCount() - offset - 1)"
            @click="table.setPageIndex(table.getPageCount() - offset - 1)"
            >{{ table.getPageCount() - offset }}</a
          >
        </div>
      </template>

      <a
        class="next_page"
        :aria-disabled="!table.getCanNextPage()"
        @click="table.getCanNextPage() ? table.nextPage() : null"
        >次</a
      >
    </div>
  </nav>
  <div style="text-align: center">
    表示数
    <select v-model="perPage" class="form-select" aria-label="表示数" @change="changePerPage">
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
  </div>
</template>
