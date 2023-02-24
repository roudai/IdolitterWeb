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

created = ref(true)
</script>

<template>
  <div v-if="created">
    <h3 class="mb-2">アイドル一覧</h3>
    <TableBody :table="table" />
    <TablePagination :table="table" />
  </div>
</template>
