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
      v-on="$listeners"
    />
  </div>
</template>

<script>
import BaseInput from './BaseInput';

const PROPS = {
  autofocus: {},
  options: Object,
  value: [String, Number],
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false }
};

export default {
  components: {
    'base-input': BaseInput
  },
  props: PROPS,
  inheritAttrs: false
};
</script>
