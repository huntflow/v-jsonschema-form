<template>
  <component
    :is="widgetCls"
    :id="id"
    multiple
    :options="widgetWithOptions.options"
    :schema="resolvedSchema"
    :registry="registry"
    :value="formData"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :label="label"
    :description="description"
    :placeholder="placeholder"
    :autofocus="autofocus"
    :raw-errors="rawErrors"
    :raw-error-infos="rawErrorInfos"
    v-on="$listeners"
  />
</template>

<script>
import { getWidget, getUiOptions, optionsList } from '../../utils';

const PROPS = {
  label: String,
  description: String,
  placeholder: String,
  schema: Object,
  id: String,
  uiSchema: Object,
  formData: Array,
  registry: { type: Object, required: true },
  rawErrors: Array,
  rawErrorInfos: Array,
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false }
};

export default {
  name: 'ArrayFieldMultiSelect',
  inject: ['resolveSchemaShallowly'],
  props: PROPS,
  computed: {
    resolvedSchema() {
      return this.resolveSchemaShallowly(this.schema, this.formData);
    },
    widgetCls() {
      return getWidget(this.resolvedSchema, this.widgetWithOptions.widget, this.registry.widgets);
    },
    widgetWithOptions() {
      const itemsSchema = this.resolveSchemaShallowly(this.resolvedSchema.items, this.formData);
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
