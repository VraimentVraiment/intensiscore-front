<script setup lang="ts">
import {
  type ItemValue,
  type Question,
} from 'survey-core'

const props = defineProps<{
  question: Question
  item: ItemValue
}>()

const getQuestionPrefix = (question: Question, item: ItemValue) => {
  if (question.name === 'building-usage__category') {
    return getParentCategoryPrefix(item.value)
  }
  else if (question.name === 'building-usage__subCategory') {
    return getChildCategoryPrefix(item.value)
  }
  else {
    const itemIndex = question.visibleChoices.indexOf(item)
    return getAlphabetLetter(itemIndex).toUpperCase()
  }
}

const questionPrefix = getQuestionPrefix(props.question, props.item)
const isPrefixOblong = questionPrefix.length > 1
</script>

<template>
  <div
    role="presentation"
    :class="[
      'item',
      { 'item--selected': question.isItemSelected(item) },
      { radio: question.getType() === 'radiogroup' },
      { checkbox: question.getType() === 'checkbox' },
    ]"
    :data-category="item.value"
  >
    <label
      tabindex="0"
      :class="[
        'item__label',
      ]"
      @keydown.enter="() => {
        question.clickItemHandler(item, !question.isItemSelected(item));
      }"
    >
      <input
        :id="question.getItemId(item)"
        :class="[
          'item__input',
        ]"
        role="option"
        :type="question.getType() === 'radiogroup' ? 'radio' : 'checkbox'"
        :name="question.name + item.value"
        :checked="question.isItemSelected(item)"
        :value="item.value"
        @input="(e) => {
          question.clickItemHandler(item, (e.target as HTMLInputElement).checked);
        }"
      >
      <span
        :class="[
          'item__prefix',
          { 'item__prefix--oblong': isPrefixOblong },
        ]"
      >
        {{ questionPrefix }}
      </span>
      <survey-string
        :class="[
          'item__text',
        ]"
        :loc-string="item.locText"
      />
    </label>
  </div>
</template>

<style scoped lang="scss">
.item {
  --current-border-color: #{$border--default};

  border-radius: $border-radius--sm;
  color: $text--default;
  margin: 1px;
  border: 1px solid var(--current-border-color);
  background-color: $background--default;
  box-shadow: $shadow--sm;

  &+.item {
    margin-top: 1rem;
  }

  @include use-category-color {
    background-color: var(--category-color-light);
  }

  &:hover {
    --current-border-color: #{$border--hover};

    color: $text--hover;
    background-color: $background--hover;

    @include use-category-color {
      background-color: var(--category-color);
    }
  }

  &:active {
    --current-border-color: #{$border--active};

    color: $text--active;
    background-color: $background--active;

    @include use-category-color {
      background-color: var(--category-color-xdark);
    }
  }

  &.item--selected {
    --current-border-color: #{$border--active};

    outline: .5px solid $border--active;
    color: $text--active;
    background-color: $background--active;

    @include use-category-color {
      background-color: var(--category-color-dark);
    }
  }
}

.item__label {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  padding: 1rem;
  gap: 1rem;

  :deep(.detailed-choice) {
    display: flex;
    flex-direction: column;

    .choice__text {
      margin-bottom: 0.5rem;
    }

    .choice__help{
      font-size: 0.85rem;
    }
  }
}

.item__input {
  display: none;
}

.item__prefix {
  font-weight: 500;
  background-color: $background--default;
  border: 1px solid var(--current-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  width: 2.5rem;

  &.item__prefix--oblong {
    width: 4rem;
  }

  .item--selected & {
    outline: .5px solid $border--active;
    font-weight: 600;
  }

  .radio & {
    border-radius: 1.25rem;
  }

  .checkbox & {
    border-radius: $border-radius--sm;
  }
}

.item__text {
  flex-basis: 100%;
  flex-shrink: 2;
  white-space: normal;
}
</style>
