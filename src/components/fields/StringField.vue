<template>
  <component
    :is="widgetCls"
    :id="idSchema && idSchema.$id"
    :options="widgetOptions"
    :schema="schema"
    :label="label"
    :description="description"
    :value="formData"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :autofocus="autofocus"
    :registry="registry"
    :placeholder="placeholder"
    :raw-errors="rawErrors"
    :raw-error-infos="rawErrorInfos"
    v-on="$listeners"
  />
</template>

<script>
import {
  getWidget,
  getUiOptions,
  isSelect,
  optionsList,
  hasWidget
} from '../../utils';

const PROPS = {
  schema: Object,
  name: String,
  label: String,
  description: String,
  uiSchema: Object,
  idSchema: Object,
  formData: [String, Number],
  registry: { type: Object, required: true },
  rawErrors: { type: Array },
  rawErrorInfos: { type: Array },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false }
};

export default {
  props: PROPS,
  computed: {
    enumOptions() {
      return isSelect(this.schema) && optionsList(this.schema);
    },
    widgetCls() {
      const { format } = this.schema;
      const { widgets } = this.registry;
      let defaultWidget = this.enumOptions ? 'select' : 'text';
      if (format && hasWidget(this.schema, format, widgets)) {
        defaultWidget = format;
      }
      const { widget = defaultWidget } = getUiOptions(this.uiSchema);
      return getWidget(this.schema, widget, widgets);
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
    }
  },
  methods: {
    handleEvent(event, ...args) {
      this.$emit(event, ...args);
    }
  }
};
</script>
