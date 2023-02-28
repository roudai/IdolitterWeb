<script setup lang="ts">
import { getCoreRowModel, useVueTable, ColumnDef, createColumnHelper, getPaginationRowModel } from '@tanstack/vue-table'

type User = {
  rank: number
  TwitterName: string
  TwitterID: string
  group: string
  oldNum: number
  newNum: number
  increaseNum: number
}
type dataObject = { [key: string]: string[][] }

// スプレッドシートからデータ取得
const idolData: dataObject = await getData('取得差分!I1:N201')
// ランキングを作成
const rankData: User[] = createRank(idolData.values)
const userList = ref<User[]>(Object.values(rankData))
// テーブル列データ設定
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
// フォロワー増加数ランキングテーブル作成
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
