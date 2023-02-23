<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  ColumnDef,
  createColumnHelper,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
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
type User = {
  group: string
  lastName: string
  firstName: string
  firstYomi: string
  lastYomi: string
  TwitterID: string
  profile: string
  follower: number
  tweet: number
}
const output: { [key: string]: User } = idolData.values.reduce(
  (
    acc: { [key: string]: User },
    [group, lastName, firstName, lastYomi, firstYomi, TwitterID, profile, follower, tweet],
    index
  ) => {
    acc[index] = {
      group,
      lastName,
      firstName,
      lastYomi,
      firstYomi,
      TwitterID,
      profile,
      follower: Number(follower),
      tweet: Number(tweet),
    }
    return acc
  },
  {}
)

const userList = ref<User[]>(Object.values(output))

const columnHelper = createColumnHelper<User>()
const columns: ColumnDef<User, any>[] = [
  columnHelper.accessor('group', { header: () => 'グループ', cell: (info) => info.getValue() }),
  columnHelper.accessor((row) => `${row.lastName} ${row.firstName}`, { id: '名前' }),
  columnHelper.accessor((row) => `${row.lastYomi} ${row.firstYomi}`, { id: '読み' }),
  columnHelper.accessor('TwitterID', {
    cell: (info) => h('a', { href: 'https://twitter.com/' + info.getValue(), target: '_blank' }, info.getValue()),
  }),
  columnHelper.accessor('follower', { header: () => 'フォロワー', cell: (info) => info.getValue() }),
  columnHelper.accessor('tweet', { header: () => 'ツイート', cell: (info) => info.getValue() }),
]

const sorting = ref<SortingState>([])

// テーブル作成
const table = useVueTable({
  get data() {
    return userList.value
  },
  columns,
  // 行モデル
  getCoreRowModel: getCoreRowModel(),
  // ソート
  state: {
    get sorting() {
      return sorting.value
    },
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
  },
  getSortedRowModel: getSortedRowModel(),
  // ページネーション
  getPaginationRowModel: getPaginationRowModel(),
  // フィルター
  getFilteredRowModel: getFilteredRowModel(),
})

created = ref(true)

const currentPage = (page: number) => {
  return table.getState().pagination.pageIndex === page
}
</script>

<template>
  <div v-if="created">
    <input class="form-control" type="text" value="globalFilter ?? ''" />
    <div class="table-scroll">
      <table :border="1">
        <caption>
          アイドル一覧
        </caption>
        <thead>
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :colSpan="header.colSpan"
              :style="header.column.getCanSort() ? 'cursor: pointer' : ''"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <template v-if="!header.isPlaceholder">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                {{
                  // ソート状態を表現
                  { asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string]
                }}
              </template>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id">
            <td v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
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
            <a :aria-label="`Page ${i}`" :aria-current="currentPage(i - 1)" @click="table.setPageIndex(i - 1)">{{
              i
            }}</a>
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
