<template>
  <component
    :is="widgetWithOptions.widget"
    :id="id"
    :options="widgetWithOptions.options"
    :schema="schema"
    :label="label"
    :value="formState"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :autofocus="autofocus"
    :registry="registry"
    :raw-errors="errorsMessages"
    :raw-error-infos="errors"
    v-on="$listeners"
    @change="handleChange"
  />
</template>

<script>
import { getWidget, getUiOptions, optionsList } from '../../utils';

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
  errors: {
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
  inject: ['setFormDataByPath'],
  props: PROPS,
  computed: {
    enumOptions() {
      return optionsList({
        enum: this.schema.enum || [true, false],
        enumNames:
          this.schema.enumNames ||
          (this.schema.enum && this.schema.enum[0] === false ? ['no', 'yes'] : ['yes', 'no'])
      });
    },
    widgetWithOptions() {
      const { widgets } = this.registry;
      // eslint-disable-next-line no-unused-vars
      const { widget = 'checkbox', placeholder, ...options } = getUiOptions(this.uiSchema);
      return {
        widget: getWidget(this.schema, widget, widgets),
        options: { ...options, enumOptions: this.enumOptions }
      };
    },
    errorsMessages() {
      // TODO: кажется что дропнуть, толку в этом мало, но мало ли где-то используются чисто текста, для мажорной версии
      return this.errors.map(({ message }) => message);
    }
  },
  methods: {
    handleChange(value) {
      this.setFormDataByPath(this.pointer, value);
    }
  }
};
</script>
