<template>
  <textarea
    :id="id"
    class="form-control"
    :autoFocus="autofocus"
    :disabled="disabled"
    :placeholder="placeholder"
    :readOnly="readonly"
    :required="required"
    :rows="options.rows"
    :value="typeof value === 'undefined' ? '' : value"
    @blur="handleBlur"
    @change="handleChange"
    @focus="handleFocus"
  />
</template>

<script>
const PROPS = {
  id: String,
  options: { default: () => ({}) },
  placeholder: String,
  value: String,
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autofocus: { default: false }
};

export default {
  inheritAttrs: false,
  props: PROPS,
  methods: {
    handleBlur(event) {
      this.$emit('blur', this.id, event.target.value);
    },
    handleFocus(event) {
      this.$emit('focus', this.id, event.target.value);
    },
    handleChange({ target: { value } }) {
      const emitValue = value === '' ? this.options.emptyValue : value;
      this.$emit('change', emitValue);
    }
  }
};
</script>
