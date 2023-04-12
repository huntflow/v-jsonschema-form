<template>
  <base-input
    type="password"
    class="form-control"
    :autofocus="autofocus"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :value="value"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @change="$emit('change', $event)"
  />
</template>

<script>
import BaseInput from './BaseInput';

const PROPS = {
  autofocus: {},
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  value: String,
  options: Object
};

export default {
  components: {
    'base-input': BaseInput
  },
  inheritAttrs: false,
  props: PROPS,
  emits: ['change', 'focus', 'blur']
};
</script>
