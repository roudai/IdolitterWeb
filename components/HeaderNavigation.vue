<template>
  <nav class="d-flex">
    <details class="details-reset details-overlay">
      <summary
        class="Header-link px-3 d-flex flex-items-center"
        aria-haspopup="true"
        @click="$router.push('/idol')"
      >
        アイドル一覧
      </summary>
    </details>
    <details class="details-reset details-overlay">
      <summary
        class="Header-link px-3 d-flex flex-items-center"
        aria-haspopup="true"
        @click="$router.push('/group')"
      >
        グループ一覧
      </summary>
    </details>
    <details class="details-reset details-overlay">
      <summary
        class="Header-link px-3 d-flex flex-items-center"
        aria-haspopup="true"
        @click="$router.push('/ranking')"
      >
        ランキング
      </summary>
    </details>
    <details class="details-reset details-overlay">
      <summary
        class="Header-link px-3 d-flex flex-items-center"
        aria-haspopup="true"
        @click="$router.push('/history')"
      >
        履歴
      </summary>
    </details>
  </nav>
</template>
