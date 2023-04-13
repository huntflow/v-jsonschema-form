<template>
  <div>
    {{ $attrs.id }} TODO: remove later
    <base-input
      type="text"
      class="form-control"
      :autofocus="autofocus"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :value="value"
      :options="options"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @change="$emit('change', $event)"
    />
  </div>
</template>

<script>
import BaseInput from './BaseInput';

const PROPS = {
  autofocus: {},
  options: { type: Object, default: () => ({}) },
  value: [String, Number],
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false }
};

export default {
  components: {
    'base-input': BaseInput
  },
  inheritAttrs: false,
  props: PROPS,
  emits: ['focus', 'blur', 'change']
};
</script>
