<script setup lang="ts">
import {
  getCoreRowModel,
  useVueTable,
  ColumnDef,
  createColumnHelper,
  getPaginationRowModel,
  SortingState,
} from '@tanstack/vue-table'

// スプレッドシートからデータ取得
const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.baseURL + '取得差分一覧?'
const params = {
  key: runtimeConfig.public.apiKey,
  range: '取得差分!I1:N101',
}
const qyeryParams = new URLSearchParams(params)
const { data } = await useFetch(baseUrl + qyeryParams)

type dataObject = { [key: string]: string[][] }
const idolData: dataObject = data.value as dataObject
idolData.values.shift()

// 取得データを整形
type User = {
  group: string
  TwitterID: string
  TwitterName: string
  oldFollower: number
  newFollower: number
  followerRanking: number
}
const output: { [key: string]: User } = idolData.values.reduce(
  (acc: { [key: string]: User }, [group, TwitterID, TwitterName, oldFollower, newFollower, followerRanking], index) => {
    acc[index] = {
      group,
      TwitterID,
      TwitterName,
      oldFollower: Number(oldFollower),
      newFollower: Number(newFollower),
      followerRanking: Number(followerRanking),
    }
    return acc
  },
  {}
)

const userList = ref<User[]>(Object.values(output))

const columnHelper = createColumnHelper<User>()
const columns: ColumnDef<User, any>[] = [
  columnHelper.accessor('group', { header: () => 'グループ', cell: (info) => info.getValue() }),
  columnHelper.accessor('TwitterID', {
    cell: (info) => h('a', { href: 'https://twitter.com/' + info.getValue(), target: '_blank' }, info.getValue()),
  }),
  columnHelper.accessor('oldFollower', { header: () => 'フォロワー', cell: (info) => info.getValue() }),
  columnHelper.accessor('newFollower', { header: () => 'ツイート', cell: (info) => info.getValue() }),
  columnHelper.accessor('followerRanking', { header: () => 'ツイート', cell: (info) => info.getValue() }),
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
    <h3 class="mb-2">フォロワー増加数ランキング</h3>
    <TableBody :table="table" />
    <TablePagination :table="table" :per-page-show="false" />
  </div>
</template>
