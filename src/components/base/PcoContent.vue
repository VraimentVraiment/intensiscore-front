<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <ClientOnly>
    <div
      v-dompurify-html="content"
      class="wysiwyg mt-4"
    />
  </ClientOnly>
</template>

<style scoped lang="scss">
.wysiwyg:deep() {
  p {
    margin-bottom: 1rem;
  }

  ul {
    list-style: disc !important;
  }

  ol {
    list-style: decimal !important;
  }

  ul,
  ol {
    padding-left: 1rem !important;
    margin-left: 1rem !important;
    margin-bottom: 1em;

    li+li {
      margin-top: 0.5em;
    }

    .p1,
    .p2,
    .p3,
    .p4,
    .p5,
    .p6 {
      padding: 0 !important;
    }
  }

  table,
  th,
  td {
    border: 1px solid $border--default;
    border-collapse: collapse;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid $border--default;
    margin-bottom: 1rem;

    colgroup {
      col {
        width: auto !important;
      }
    }

    td,
    .p1,
    .p2,
    .p3,
    .p4,
    .p5 {
      padding: 0.25rem;
    }

    thead {
      background-color: $contrast-background--default;
      color: $contrast-text--default !important;
      width: calc( 100% - 1em );

      p {
        color: inherit !important;
      }
    }

    tbody {
      max-height: 500px;
      overflow-y: auto;
      display: block;

      tr {
        &:nth-of-type(odd) {
          background-color: $background--default;
        }
      }
    }

    thead,
    tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }
  }
}
</style>
