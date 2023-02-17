<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  ColumnDef,
  createColumnHelper,
  getPaginationRowModel,
} from '@tanstack/vue-table'

let created = ref(false)

// スプレッドシートからデータ取得
const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.baseURL + 'アイドル一覧?'
const params = {
  key: runtimeConfig.public.apiKey,
}
const qyeryParams = new URLSearchParams(params)
const { data } = await useFetch(baseUrl + qyeryParams)

type dataObject = { [key: string]: string[][] }
const idolData: dataObject = data.value as dataObject
idolData.values.shift()

// 取得データを整形
type User = { [key: string]: string | number }
const output: { [key: string]: User } = idolData.values.reduce(
  (
    acc: { [key: string]: User },
    [
      group,
      lastName,
      firstName,
      lastYomi,
      firstYomi,
      TwitterID,
      _profile,
      follower,
      tweet,
    ],
    index
  ) => {
    acc[index] = {
      グループ: group,
      名前: lastName + ' ' + firstName,
      読み: lastYomi + ' ' + firstYomi,
      TwitterID,
      フォロワー: follower,
      ツイート: tweet,
    }
    return acc
  },
  {}
)

const userList = ref<User[]>(Object.values(output))

const columnHelper = createColumnHelper<User>()
const columns: ColumnDef<User, any>[] = [
  columnHelper.accessor('グループ', { cell: (info) => info.getValue() }),
  columnHelper.accessor('名前', { cell: (info) => info.getValue() }),
  columnHelper.accessor('読み', { cell: (info) => info.getValue() }),
  columnHelper.accessor('TwitterID', { cell: (info) => info.getValue() }),
  columnHelper.accessor('フォロワー', { cell: (info) => info.getValue() }),
  columnHelper.accessor('ツイート', { cell: (info) => info.getValue() }),
]

const table = useVueTable({
  get data() {
    return userList.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

created = ref(true)

const currentPage = (page: number) => {
  return table.getState().pagination.pageIndex === page
}
</script>

<template>
  <div v-if="created">
    <div class="table-scroll">
      <table :border="1">
        <caption>
          アイドル一覧
        </caption>
        <thead>
          <tr
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id">
            <td v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ページネーション -->
    <nav class="paginate-container" aria-label="Pagination">
      <div class="pagination">
        <a
          class="previous_page"
          :aria-disabled="!table.getCanPreviousPage()"
          @click="table.previousPage"
          >前</a
        >
        <a
          aria-label="Page 1"
          :aria-current="currentPage(0)"
          @click="table.setPageIndex(0)"
          >1</a
        >
        <a
          aria-label="Page 2"
          :aria-current="currentPage(1)"
          @click="table.setPageIndex(1)"
          >2</a
        >
        <a
          aria-label="Page 3"
          :aria-current="currentPage(2)"
          @click="table.setPageIndex(2)"
          >3</a
        >
        <span class="gap">…</span>
        <a
          aria-label="Page 8"
          :aria-current="currentPage(table.getPageCount() - 3)"
          @click="table.setPageIndex(table.getPageCount() - 3)"
          >{{ table.getPageCount() - 2 }}</a
        >
        <a
          aria-label="Page 9"
          :aria-current="currentPage(table.getPageCount() - 2)"
          @click="table.setPageIndex(table.getPageCount() - 2)"
          >{{ table.getPageCount() - 1 }}</a
        >
        <a
          aria-label="Page 10"
          :aria-current="currentPage(table.getPageCount() - 1)"
          @click="table.setPageIndex(table.getPageCount() - 1)"
          >{{ table.getPageCount() }}</a
        >
        <a
          class="next_page"
          :aria-disabled="!table.getCanNextPage()"
          @click="table.nextPage"
          >次</a
        >
      </div>
    </nav>
  </div>
</template>

<style>
html {
  caret-color: transparent;
}

.table-scroll {
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.table-scroll::-webkit-scrollbar {
  display: none;
}

table {
  width: 100%;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  margin: 3px auto;
}
caption {
  font-size: 1.5em;
  text-align: left;
  margin-bottom: 0.5em;
}
td {
  border-bottom: 1px dashed #999;
  padding: 0.5em;
}
th,
tr:last-child td {
  border-bottom: 2px solid #005ab3;
  padding: 0.5em;
}
</style>
