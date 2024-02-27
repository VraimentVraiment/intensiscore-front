<script lang="ts" setup>
// import { useDropZone } from '@vueuse/core'

// const props = withDefaults(defineProps<{
withDefaults(defineProps<{
  acceptTypes?: string[]
  hasFile?: boolean
  size?: 'sm' | 'md'
  dropLabel?: string
  importLabel?: string
  replaceLabel?: string
  deleteLabel?: string
  filename?: string
}>(), {
  acceptTypes: () => ['*'],
  size: 'md',
  hasFile: false,
  dropLabel: 'Glissez un fichier ici',
  importLabel: 'Importer un fichier',
  replaceLabel: 'Remplacer le fichier actuel',
  deleteLabel: 'Supprimer le fichier actuel',
})

const emit = defineEmits([
  'file-read',
  'reset',
])

// const dropzone = ref<HTMLDivElement>()

const doReadFile = (file: File | null): void => {
  if (file) {
    return readFile(file, (content) => {
      emit('file-read', {
        file,
        content,
      })
    })
  }
}

const onFileChange = (e: Event) => {
  doReadFile((e.target as HTMLInputElement).files?.[0] || null)
}

// const onDrop = (files: File[] | null) => {
//   doReadFile(files?.[0] || null)
// }

// const { isOverDropZone } = useDropZone(dropzone, {
//   onDrop,
//   dataTypes: props.acceptTypes,
// })
</script>

<template>
  <div
    :class="[
      'file-management',
      { 'file-management--sm': size === 'sm' },
      { 'file-management--md': size === 'md' },
    ]"
  >
    <!-- <div
      ref="dropzone"
      :class="[
        'file-management__dropzone',
        'hidden md:flex',
        { 'is-over-drop-zone': isOverDropZone },
      ]"
    >
      <p class="file-management__dropzone-label">
        <span>{{ dropLabel }}</span>
        <span>
          <Icon name="ri:drag-drop-line" />
        </span>
      </p>
    </div> -->
    <div class="file-management__commands">
      <PcoButton
        class="file-management__input"
        :icon="'ri:file-upload-line'"
        type="file"
        :class="[
          'file-management__delete',
        ]"
        :label="hasFile ? replaceLabel : importLabel"
        @change="onFileChange"
      />
      <PcoButton
        v-if="hasFile"
        :icon="'ri:delete-bin-line'"
        secondary
        :class="[
          'file-management__delete',
        ]"
        :label="deleteLabel"
        @click="() => $emit('reset')"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.file-management {
  margin-bottom: 2rem;

  &--sm {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: stretch;
  }

  &__dropzone {
    border: 2px dashed $border--default;
    border-radius: 0.5rem;
    background-color: $background--default;
    justify-content: center;
    align-items: center;

    .file-management--sm & {
      flex: 1;
    }

    .file-management--md & {
      height: 10rem;
    }

    p {
      text-align: center;
      font-size: 1.25rem;
      color: $alt-text--default;
    }

    &.is-over-drop-zone {
      border-color: $border--active;
      background-color: $background--active;

      p {
        color: $alt-text--active;
      }
    }
  }

  &__dropzone-label {
    display: flex;
    gap: 0.5em;
    justify-content: center;
    align-items: center;

    :deep(svg) {
      height: 1.25em;
      width: 1.25em;
    }
  }

  &__commands {
    display: flex;
    gap: 1rem;

    .file-management--sm & {
      flex: 1;
      flex-direction: column;
      gap: 0.5rem;
    }

    .file-management--md & {
      margin-top: 1rem;
    }
  }

  &__input {
    label {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    input[type="file"] {
      display: none;
    }
  }
}
</style>
