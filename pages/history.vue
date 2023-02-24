<script setup lang="ts">
import {
  getCoreRowModel,
  useVueTable,
  ColumnDef,
  createColumnHelper,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/vue-table'

// スプレッドシートからデータ取得
const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.baseURL + '履歴?'
const params = {
  key: runtimeConfig.public.apiKey,
  range: '履歴!A1:G501',
}
const qyeryParams = new URLSearchParams(params)
const { data } = await useFetch(baseUrl + qyeryParams)

type dataObject = { [key: string]: string[][] }
const idolData: dataObject = data.value as dataObject
idolData.values.shift()

// 取得データを整形
type User = {
  group: string
  oldTwitterID: string
  newTwitterID: string
  TwitterName: string
  deleteDay: string
  content: string
  runTime: string
}
const output: { [key: string]: User } = idolData.values.reduce(
  (
    acc: { [key: string]: User },
    [group, oldTwitterID, newTwitterID, TwitterName, deleteDay, content, runTime],
    index
  ) => {
    acc[index] = {
      group,
      oldTwitterID,
      newTwitterID,
      TwitterName,
      deleteDay,
      content,
      runTime,
    }
    return acc
  },
  {}
)

const userList = ref<User[]>(Object.values(output))

const columnHelper = createColumnHelper<User>()
const columns: ColumnDef<User, any>[] = [
  columnHelper.accessor('group', { header: () => 'グループ', cell: (info) => info.getValue() }),
  columnHelper.accessor('oldTwitterID', { header: () => '旧TwitterID', cell: (info) => info.getValue() }),
  columnHelper.accessor('newTwitterID', {
    header: () => '新TwitterID',
    cell: (info) => h('a', { href: 'https://twitter.com/' + info.getValue(), target: '_blank' }, info.getValue()),
  }),
  columnHelper.accessor('TwitterName', { header: () => '名前', cell: (info) => info.getValue() }),
  columnHelper.accessor('deleteDay', { header: () => '卒業解散予定', cell: (info) => info.getValue() }),
  columnHelper.accessor('content', { header: () => '内容', cell: (info) => info.getValue() }),
  columnHelper.accessor('runTime', { header: () => '実行日時', cell: (info) => info.getValue() }),
]

const sorting = ref<SortingState>([])

// テーブル作成
const table = useVueTable({
  get data() {
    return userList.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  state: {
    get sorting() {
      return sorting.value
    },
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === 'function' ? updaterOrValue(sorting.value) : updaterOrValue
  },
})
</script>

<template>
  <div>
    <h3 class="mb-2">アイドル一覧</h3>
    <TableBody :table="table" />
    <TablePagination :table="table" />
  </div>
</template>
