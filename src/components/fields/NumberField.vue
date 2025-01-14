<template>
  <component :is="stringFieldCls" v-bind="$props" @change="$emit('change', $event)" />
</template>

<script>
const PROPS = {
  schema: Object,
  name: String,
  label: String,
  description: String,
  uiSchema: Object,
  id: String,
  pointer: {
    type: String,
    required: true
  },
  formData: {
    type: [String, Number],
    default: undefined
  },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
  registry: { type: Object, required: true },
  errorSchema: { type: Array, default: () => [] }
};

export default {
  name: 'NumberField',
  compatConfig: {
    MODE: 3
  },
  props: PROPS,
  emits: ['change'],
  computed: {
    stringFieldCls() {
      return this.registry.fields.StringField;
    }
  }
};
</script>
