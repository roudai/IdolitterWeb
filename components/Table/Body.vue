<script setup lang="ts">
import { FlexRender } from '@tanstack/vue-table'

const props = defineProps({
  table: {
    type: Object,
    default: null,
  },
})
</script>

<template>
  <div class="table-scroll">
    <table :border="1">
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
</template>

<style scoped>
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
