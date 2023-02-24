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
  TwitterName: string
  follower: number
  tweet: number
  certification: string
  tweetprivate: string
  TwitterId: string
  profile: string
  history: string
  deleteDay: string
}
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
      TwitterName,
      follower,
      tweet,
      certification,
      tweetprivate,
      TwitterId,
      profile,
      history,
      deleteDay,
    ],
    index
  ) => {
    acc[index] = {
      group,
      lastName,
      firstName,
      lastYomi,
      firstYomi,
      TwitterID,
      TwitterName,
      follower: Number(follower),
      tweet: Number(tweet),
      certification,
      tweetprivate,
      TwitterId,
      profile,
      history,
      deleteDay,
    }
    return acc
  },
  {}
)

const userList = ref<User[]>(Object.values(output))

const columnHelper = createColumnHelper<User>()
const columns: ColumnDef<User, any>[] = [
  columnHelper.accessor('group', { header: () => 'グループ', cell: (info) => info.getValue(), enableSorting: false }),
  columnHelper.accessor((row) => `${row.lastName} ${row.firstName}`, { id: '名前', enableSorting: false }),
  columnHelper.accessor((row) => `${row.lastYomi} ${row.firstYomi}`, { id: '読み', enableSorting: false }),
  columnHelper.accessor('TwitterID', {
    cell: (info) => h('a', { href: 'https://twitter.com/' + info.getValue(), target: '_blank' }, info.getValue()),
    enableSorting: false,
  }),
  columnHelper.accessor('follower', {
    header: () => 'フォロワー',
    cell: (info) => info.getValue(),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('tweet', {
    header: () => 'ツイート',
    cell: (info) => info.getValue(),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('deleteDay', {
    header: () => '卒業解散予定',
    cell: (info) => info.getValue(),
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
]

const sorting = ref<SortingState>([])

// テーブル作成
const table = useVueTable({
  get data() {
    return userList.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
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
    <TableHead :table="table" />
    <TableBody :table="table" />
    <TablePagination :table="table" />
  </div>
</template>
