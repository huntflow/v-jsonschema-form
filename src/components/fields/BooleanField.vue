<template>
  <component
    :is="widgetWithOptions.widget"
    :id="id"
    :options="widgetWithOptions.options"
    :schema="schema"
    :label="label"
    :value="formData"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :autofocus="autofocus"
    :registry="registry"
    :error-schema="errorSchema"
    :pointer="pointer"
    v-on="$listeners"
    @change="handleChange"
  />
</template>

<script>
import { getWidget, getUiOptions } from '../../utils';

const PROPS = {
  name: String,
  label: String,
  description: String,
  schema: Object,
  uiSchema: Object,
  id: String,
  pointer: {
    type: String,
    required: true
  },
  formData: Boolean,
  errorSchema: {
    type: Array,
    default: () => []
  },
  registry: { type: Object, required: true },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false }
};

export default {
  name: 'BooleanField',
  inject: ['setFormDataByPointer'],
  props: PROPS,
  computed: {
    widgetWithOptions() {
      const { widgets } = this.registry;
      // eslint-disable-next-line no-unused-vars
      const { widget = 'checkbox', placeholder, ...options } = getUiOptions(this.uiSchema);
      return {
        widget: getWidget(this.schema, widget, widgets),
        options
      };
    }
  },
  methods: {
    handleChange(value) {
      this.setFormDataByPointer(this.pointer, value);
    }
  }
};
</script>
