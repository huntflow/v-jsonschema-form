<template>
  <component
    :is="stringFieldCls"
    :form-data="formDataNumericValue"
    :schema="schema"
    :name="name"
    :ui-schema="uiSchema"
    :id-schema="idSchema"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :autofocus="autofocus"
    :registry="registry"
    :raw-errors="rawErrors"
    :raw-error-infos="rawErrorInfos"
    v-on="eventListeners"
    @change="handleChange"
  />
</template>

<script>
import pick from 'lodash/pick';
import { asNumber } from '../../utils';
const trailingCharMatcherWithPrefix = /\.([0-9]*0)*$/;
const trailingCharMatcher = /[0.]0*$/;

const PROPS = {
  schema: Object,
  name: String,
  uiSchema: Object,
  idSchema: Object,
  formData: Number,
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
  registry: { type: Object, required: true },
  rawErrors: { type: Array },
  rawErrorInfos: { type: Array }
};

export default {
  props: PROPS,
  data() {
    return {
      // TODO: seems there's an issue in the react library..
      lastValue: this.formData
    };
  },
  computed: {
    eventListeners() {
      return pick(this.$listeners, ['focus', 'blur']);
    },
    stringFieldCls() {
      return this.registry.fields.StringField;
    },
    formDataNumericValue() {
      let value = this.formData;
      if (typeof this.lastValue === 'string' && typeof value === 'number') {
        // Construct a regular expression that checks for a string that consists
        // of the formData value suffixed with zero or one '.' characters and zero
        // or more '0' characters
        const re = new RegExp(`${value}`.replace('.', '\\.') + '\\.?0*$');

        // If the cached "lastValue" is a match, use that instead of the formData
        // value to prevent the input value from changing in the UI
        if (this.lastValue.match(re)) {
          value = this.lastValue;
        }
      }
      return value;
    }
  },
  methods: {
    handleChange(value) {
      this.lastValue = value;
      // Normalize decimals that don't start with a zero character in advance so
      // that the rest of the normalization logic is simpler
      if (`${value}`.charAt(0) === '.') {
        value = `0${value}`;
      }

      // Check that the value is a string (this can happen if the widget used is a
      // <select>, due to an enum declaration etc) then, if the value ends in a
      // trailing decimal point or multiple zeroes, strip the trailing values
      let processed =
        typeof value === 'string' && value.match(trailingCharMatcherWithPrefix)
          ? asNumber(value.replace(trailingCharMatcher, ''))
          : asNumber(value);

      this.$emit('change', processed);
    }
  }
};
</script>
