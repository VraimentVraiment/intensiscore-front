<script lang="ts" setup>
const props = defineProps<{
  title: string
  type: 'radio' | 'checkbox'
  inputs: {
    label: string
    value: string
    checked?: boolean
  }[]
}>()

defineEmits(['update:modelValue'])

const model = props.type === 'radio'
  ? ref<string | undefined>()
  : ref<string[]>([])

if (props.type === 'radio') {
  const checkedInput = props.inputs.find(input => input.checked) ?? props.inputs[0]
  model.value = checkedInput.value
}
else {
  model.value = props.inputs.filter(input => input.checked)
    .map(input => input.value)
}

const isChecked = (value: string) => {
  if (props.type === 'radio') {
    return model.value === value
  }
  else {
    return model?.value?.includes(value)
  }
}
</script>

<template>
  <fieldset class="custom-fieldset">
    <legend
      :class="[
        'custom-fieldset__legend',
        'text-xs mb-2',
      ]"
    >
      {{ title }}
    </legend>
    <div
      :class="[
        'custom-fieldset__inputs',
        'inline-flex flex-row overflow-hidden border border-alt_border-default',
      ]"
    >
      <label
        v-for="input in inputs"
        :key="input.value"
        :class="[
          'custom-fieldset__input',
          { 'alt-action-box': !isChecked(input.value) },
          { 'contrast-box rounded-0! cursor-default!': isChecked(input.value) },
          'flex items-center justify-center py-0.5em px-1em cursor-pointer text-xs rounded-0!',
        ]"
      >
        <input
          v-model="model"
          :value="input.value"
          :type="type"
          :name="title"
          class="hidden"
          @change="$emit('update:modelValue', model)"
        >
        {{ input.label }}
      </label>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.custom-fieldset__inputs {
  border-radius: $border-radius--sm;
}

label.custom-fieldset__input {
  &:not(:last-of-type) {
    border-right: solid 1px $alt-border--default;
  }
}
</style>
