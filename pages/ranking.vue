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
const idolFollowerData: dataObject = await getData('取得差分!I1:N201')
// ランキングを作成
const rankFollowerData: User[] = createRank(idolFollowerData.values)
const userFollowerList = ref<User[]>(Object.values(rankFollowerData))
// テーブル列データ設定
const columnFollowerHelper = createColumnHelper<User>()
const followerColumns: ColumnDef<User, any>[] = [
  columnFollowerHelper.accessor('rank', {
    header: () => '順位',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnFollowerHelper.accessor('TwitterName', {
    header: () => 'TwitterName',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnFollowerHelper.accessor('TwitterID', {
    cell: (info) => h('a', { href: 'https://twitter.com/' + info.getValue(), target: '_blank' }, info.getValue()),
    enableSorting: false,
  }),
  columnFollowerHelper.accessor('group', {
    header: () => 'グループ',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnFollowerHelper.accessor('oldNum', {
    header: () => '前フォロワー数',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnFollowerHelper.accessor('newNum', {
    header: () => '後フォロワー数',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnFollowerHelper.accessor('increaseNum', {
    header: () => 'フォロワー増加数',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
]
// フォロワー増加数ランキングテーブル作成
const followerTable = useVueTable({
  get data() {
    return userFollowerList.value
  },
  columns: followerColumns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

// スプレッドシートからデータ取得
const idolTweetData: dataObject = await getData('取得差分!P1:U201')
// ランキングを作成
const rankTweetData: User[] = createRank(idolTweetData.values)
const userTweetList = ref<User[]>(Object.values(rankTweetData))
// テーブル列データ設定
const columnTweetHelper = createColumnHelper<User>()
const tweetColumns: ColumnDef<User, any>[] = [
  columnTweetHelper.accessor('rank', {
    header: () => '順位',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnTweetHelper.accessor('TwitterName', {
    header: () => 'TwitterName',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnTweetHelper.accessor('TwitterID', {
    cell: (info) => h('a', { href: 'https://twitter.com/' + info.getValue(), target: '_blank' }, info.getValue()),
    enableSorting: false,
  }),
  columnTweetHelper.accessor('group', {
    header: () => 'グループ',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnTweetHelper.accessor('oldNum', {
    header: () => '前ツイート数',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnTweetHelper.accessor('newNum', {
    header: () => '後ツイート数',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
  columnTweetHelper.accessor('increaseNum', {
    header: () => 'ツイート数',
    cell: (info) => info.getValue(),
    enableSorting: false,
  }),
]
// フォロワー増加数ランキングテーブル作成
const tweetTable = useVueTable({
  get data() {
    return userTweetList.value
  },
  columns: tweetColumns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
</script>

<template>
  <div>
    <h3 class="mb-2">フォロワー増加数ランキング</h3>
    <TableBody :table="followerTable" />
    <TablePagination :table="followerTable" :per-page-show="false" />

    <h3 class="mb-2">ツイート数ランキング</h3>
    <TableBody :table="tweetTable" />
    <TablePagination :table="tweetTable" :per-page-show="false" />
  </div>
</template>
