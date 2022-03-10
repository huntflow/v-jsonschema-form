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
    :raw-errors="errorsMessages"
    :raw-error-infos="errors"
    v-on="$listeners"
  />
</template>

<script>
import { getWidget, getUiOptions, isSelect, optionsList, hasWidget } from '../../utils';

const PROPS = {
  schema: Object,
  name: String,
  label: String,
  description: String,
  uiSchema: Object,
  id: String,
  formData: [String, Number],
  registry: { type: Object, required: true },
  errors: { type: Array, default: () => [] },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false }
};

export default {
  name: 'StringField',
  inject: ['resolveSchemaShallowly'],
  props: PROPS,
  computed: {
    resolvedSchema() {
      return this.resolveSchemaShallowly(this.schema, this.formData);
    },
    enumOptions() {
      return isSelect(this.resolvedSchema) && optionsList(this.resolvedSchema);
    },
    widgetCls() {
      const { format } = this.resolvedSchema;
      const { widgets } = this.registry;
      let defaultWidget = this.enumOptions ? 'select' : 'text';
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
      return { ...options, enumOptions: this.enumOptions };
    },
    placeholder() {
      return getUiOptions(this.uiSchema).placeholder || '';
    },
    errorsMessages() {
      // TODO: кажется что дропнуть, толку в этом мало, но мало ли где-то используются чисто текста, для мажорной версии
      return this.errors.map(({ message }) => message);
    }
  },
  methods: {
    handleEvent(event, ...args) {
      this.$emit(event, ...args);
    }
  }
};
</script>
