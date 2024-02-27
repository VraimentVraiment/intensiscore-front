<script lang="ts" setup>
const props = withDefaults(defineProps<{
  size: 'sm' | 'md' | 'lg'
  isInline?: boolean
  noBorder?: boolean
  category: string
  categoryText: string
  subCategory: string | null
  subCategoryText: string | null
  hasInput?: boolean
  checked?: boolean
  usageUserLabel: string | null
}>(), {
  isInline: false,
  size: 'md',
  category: '',
  categoryText: '',
  noBorder: false,
  subCategory: null,
  subCategoryText: null,
  usageUserLabel: null,
})

const id = props.hasInput ? useId() : undefined
const categoryType = getCategoryType(props.category)
</script>

<template>
  <div
    :class="[
      'category-viewer',
      `category-viewer--${size}`,
      { 'category-viewer--has-input': hasInput },
      { 'category-viewer--no-border': noBorder },
      'p-1em cursor-pointer flex items-center gap-3',
    ]"
    :data-category="category"
  >
    <input
      v-if="hasInput"
      type="checkbox"
      :checked="checked"
      :class="[
        'w-4 h-4 m-0',
      ]"
    >
    <component
      :is="hasInput ? 'label' : 'div'"
      :for="id"
      :class="[
        'category__records',
        'flex flex-col gap-2',
      ]"
    >
      <div
        v-if="!usageUserLabel"
        class="category__record"
      >
        <h3
          :class="[
            'text-1em m-0',
          ]"
        >
          <span v-if="categoryType === 'primary'">Usage{{ isInline ? ' :' : '' }}</span>
        </h3>
        <p
          :class="[
            'text-1em m-0',
          ]"
        >
          {{ categoryText }}
        </p>
      </div>
      <div
        v-if="!usageUserLabel && subCategoryText"
        class="category__record"
      >
        <h3
          :class="[
            'text-1em mt-2 mb-0',
          ]"
        >
          Sous-usage{{ isInline ? ' :' : '' }}
        </h3>
        <p
          :class="[
            'text-1em m-0',
          ]"
        >
          {{ subCategoryText }}
        </p>
      </div>
      <div
        v-if="usageUserLabel"
        class="category__record"
      >
        <h3
          :class="[
            'text-1em mt-2 mb-0',
          ]"
        >
          Libellé{{ isInline ? ' :' : '' }}
        </h3>
        <p
          :class="[
            'text-1em m-0',
          ]"
        >
          {{ usageUserLabel }}
        </p>
      </div>
    </component>
  </div>
</template>

<style scoped lang="scss">
.category-viewer {
  --current-border-color: #{$border--default};

  border: solid 1px var(--current-border-color);
  border-radius: $border-radius--sm;

  &--sm {
    font-size: .9rem;
  }

  &--md {
    font-size: 1rem;
  }

  &--lg {
    font-size: 1.1rem;
  }

  &--no-border {
    border-radius: 0;
    border: none;
  }

  @include use-category-color {
    background-color: var(--category-color);
  }

  &--has-input {
    input {
      border-radius: $border-radius--sm;
      border: solid 1px var(--current-border-color)
    }

    .category__records {
      gap: 0;
    }

    .category__record {
      width: 100%;
      gap: .25rem;
      cursor: pointer;

      >h3,
      >p {
        display: inline;
      }

      >p {
        margin-left: .25rem;
        text-wrap: balance;
      }
    }

    &:hover {
      --current-border-color: #{$border--hover};

      color: $text--hover;

      @include use-category-color {
        background-color: var(--category-color-dark);
      }
    }

    &:active {
      --current-border-color: #{$border--active};

      color: $text--active;

      @include use-category-color {
        background-color: var(--category-color-xdark);
      }
    }
  }
}
</style>
