<template>
  <component
    :is="widgetCls"
    :id="idSchema && idSchema.$id"
    multiple
    :on-change="onChange"
    :on-blur="onBlur"
    :on-focus="onFocus"
    :options="widgetWithOptions.options"
    :schema="schema"
    :registry="registry"
    :value="formData"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :label="label"
    :placeholder="placeholder"
    :autofocus="autofocus"
    :raw-errors="rawErrors"
    :raw-error-infos="rawErrorInfos"
    @change="onChange"
    @blur="onBlur"
    @focus="onFocus"
  />
</template>

<script>
import {
  getWidget,
  getUiOptions,
  optionsList,
  retrieveSchema,
  getDefaultRegistry
} from '../../utils';

const PROPS = {
  label: String,
  placeholder: String,
  schema: Object,
  idSchema: Object,
  uiSchema: Object,
  formData: Array,
  registry: { default: () => getDefaultRegistry() },
  rawErrors: Array,
  rawErrorInfos: Array,
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
  onBlur: Function,
  onFocus: Function,
  onChange: Function
};

export default {
  props: PROPS,
  computed: {
    widgetCls() {
      return getWidget(this.schema, this.widgetWithOptions.widget, this.registry.widgets);
    },
    widgetWithOptions() {
      const itemsSchema = retrieveSchema(this.schema.items, this.formData);
      const enumOptions = optionsList(itemsSchema);
      const { widget = 'select', ...options } = {
        ...getUiOptions(this.uiSchema),
        enumOptions
      };
      return { widget, options };
    }
  }
};
</script>
