<template>
  <component
    :is="widgetCls"
    :id="idSchema && idSchema.$id"
    multiple
    :options="widgetWithOptions.options"
    :schema="schema"
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
import { getWidget, getUiOptions, optionsList, retrieveSchema } from '../../utils';

const PROPS = {
  label: String,
  description: String,
  placeholder: String,
  schema: Object,
  idSchema: Object,
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
