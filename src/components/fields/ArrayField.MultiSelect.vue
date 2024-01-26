<template>
  <component
    :is="widgetCls"
    :id="id"
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
    :raw-errors="errorsMessages"
    :raw-error-infos="errors"
    :pointer="pointer"
    v-on="$listeners"
  />
</template>

<script>
import { getWidget, getUiOptions } from '../../utils';

const PROPS = {
  label: String,
  description: String,
  placeholder: String,
  schema: Object,
  id: String,
  pointer: {
    type: String,
    required: true
  },
  formData: {
    type: Array,
    required: true
  },
  uiSchema: Object,
  errors: { type: Array, default: () => [] },
  registry: { type: Object, required: true },
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
      const itemsSchema = this.schema.items;
      const { widget = 'select', ...options } = getUiOptions(this.uiSchema);
      return { widget, options };
    },
    errorsMessages() {
      // TODO: кажется что дропнуть, толку в этом мало, но мало ли где-то используются чисто текста, для мажорной версии
      return this.errors.map(({ message }) => message);
    }
  }
};
</script>
