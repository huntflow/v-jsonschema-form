<template>
  <component
    :is="widgetCls"
    :id="id"
    :options="widgetOptions"
    :schema="resolvedSchema"
    :label="label"
    :description="description"
    :value="formData"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :autofocus="autofocus"
    :registry="registry"
    :placeholder="placeholder"
    :error-schema="errorSchema"
    :pointer="pointer"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @change="handleChange"
  />
</template>

<script>
import { getWidget, getUiOptions, isSelect, hasWidget } from '../../utils';

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
  registry: { type: Object, required: true },
  errorSchema: { type: Array, default: () => [] },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false }
};

export default {
  name: 'StringField',
  inject: ['resolveSchemaShallowly', 'setFormDataByPointer'],
  props: PROPS,
  emits: ['focus', 'blur', 'change'],
  computed: {
    resolvedSchema() {
      return this.resolveSchemaShallowly(this.schema, this.formData);
    },
    widgetCls() {
      const { format } = this.resolvedSchema;
      const { widgets } = this.registry;
      let defaultWidget = this.resolvedSchema.enum ? 'select' : 'text';
      if (format && hasWidget(this.resolvedSchema, format, widgets)) {
        defaultWidget = format;
      }
      const { widget = defaultWidget } = getUiOptions(this.uiSchema);
      return getWidget(this.resolvedSchema, widget, widgets);
    },
    widgetOptions() {
      const {
        // eslint-disable-next-line no-unused-vars
        widget,
        // eslint-disable-next-line no-unused-vars
        placeholder,
        ...options
      } = getUiOptions(this.uiSchema);
      return options;
    },
    placeholder() {
      return getUiOptions(this.uiSchema).placeholder || '';
    }
  },
  methods: {
    handleChange(value) {
      this.setFormDataByPointer(this.pointer, value);
    }
  }
};
</script>
