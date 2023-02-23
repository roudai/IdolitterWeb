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
    <TablePagination :table="table" />
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
