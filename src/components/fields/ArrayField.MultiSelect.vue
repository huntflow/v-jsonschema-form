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
    :raw-errors="errorsMessages"
    :raw-error-infos="errors"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @change="$emit('change', $event)"
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
  errors: { type: Array, default: () => [] },
  registry: { type: Object, required: true },
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
    },
    errorsMessages() {
      // TODO: кажется что дропнуть, толку в этом мало, но мало ли где-то используются чисто текста, для мажорной версии
      return this.errors.map(({ message }) => message);
    }
  }
};
</script>
