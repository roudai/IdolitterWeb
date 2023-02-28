<script setup lang="ts">
import { getCoreRowModel, useVueTable, ColumnDef, createColumnHelper, getPaginationRowModel } from '@tanstack/vue-table'

// スプレッドシートからデータ取得
const runtimeConfig = useRuntimeConfig()
const baseUrl = runtimeConfig.public.baseURL + '取得差分一覧?'
const params = {
  key: runtimeConfig.public.apiKey,
  range: '取得差分!I1:N301',
}
const qyeryParams = new URLSearchParams(params)
const { data } = await useFetch(baseUrl + qyeryParams)

type dataObject = { [key: string]: string[][] }
const idolData: dataObject = data.value as dataObject
idolData.values.shift()

// 取得データを整形
type User = {
  rank: number
  TwitterName: string
  TwitterID: string
  group: string
  oldNum: number
  newNum: number
  increaseNum: number
}
const rankData: User[] = []
let rank = 1
let rankup = 0
for (let i = 0; i < idolData.values.length; i++) {
  if (rank > 100) {
    break
  }
  const oldNum = Number(idolData.values[i][3])
  const newNum = Number(idolData.values[i][4])
  const increaseNum = Number(idolData.values[i][5])
  if (oldNum === 0 || newNum / oldNum >= 3) {
    continue
  }

  rankData.push({
    rank,
    TwitterName: idolData.values[i][2],
    TwitterID: idolData.values[i][1],
    group: idolData.values[i][0],
    oldNum,
    newNum,
    increaseNum,
  })

  if (idolData.values[i][5] === idolData.values[i + 1][5]) {
    rankup = rankup + 1
  } else {
    rank = rank + rankup + 1
    rankup = 0
  }
}

const userList = ref<User[]>(Object.values(rankData))

const columnHelper = createColumnHelper<User>()
const columns: ColumnDef<User, any>[] = [
  columnHelper.accessor('rank', { header: () => '順位', cell: (info) => info.getValue(), enableSorting: false }),
  columnHelper.accessor('TwitterName', {
    header: () => 'TwitterName',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnHelper.accessor('TwitterID', {
    cell: (info) => h('a', { href: 'https://twitter.com/' + info.getValue(), target: '_blank' }, info.getValue()),
    enableSorting: false,
  }),
  columnHelper.accessor('group', { header: () => 'グループ', cell: (info) => info.getValue(), enableSorting: false }),
  columnHelper.accessor('oldNum', {
    header: () => '前フォロワー数',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnHelper.accessor('newNum', {
    header: () => '後フォロワー数',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnHelper.accessor('increaseNum', {
    header: () => 'フォロワー増加数',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
]

// テーブル作成
const table = useVueTable({
  get data() {
    return userList.value
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
</script>

<template>
  <div>
    <h3 class="mb-2">フォロワー増加数ランキング</h3>
    <TableBody :table="table" />
    <TablePagination :table="table" :per-page-show="false" />
  </div>
</template>
