<template>
  <select
    :id="id"
    :multiple="multiple"
    v-bind="options"
    class="form-control"
    :value="typeof value === 'undefined' ? emptyValue : value"
    :required="required"
    :disabled="isDisabled"
    :autoFocus="autofocus"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange"
  >
    <option v-if="!multiple && schema.default === undefined" value="">
      {{ placeholder }}
    </option>
    <option
      v-for="(enumOption, index) in enumOptions"
      :key="index"
      :disabled="isOptionDisabled(enumOption.value)"
      :value="enumOption.value"
    >
      {{ enumOption.label }}
    </option>
  </select>
</template>

<script>
import { asNumber, guessType } from '../../utils';
const nums = new Set(['number', 'integer']);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
function processValue(schema, value) {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type, items } = schema;
  if (value === '') {
    return undefined;
  } else if (type === 'array' && items && nums.has(items.type)) {
    return value.map(asNumber);
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return asNumber(value);
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every((x) => guessType(x) === 'number')) {
      return asNumber(value);
    } else if (schema.enum.every((x) => guessType(x) === 'boolean')) {
      return value === 'true';
    }
  }

  return value;
}

function getValue(event, multiple) {
  if (multiple) {
    return [].slice
      .call(event.target.options)
      .filter((o) => o.selected)
      .map((o) => o.value);
  } else {
    return event.target.value;
  }
}

const PROPS = {
  schema: Object,
  id: String,
  value: [Number, String, Boolean],
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
  placeholder: String,
  options: { type: Object, default: () => ({}) }
};

export default {
  props: PROPS,
  computed: {
    isDisabled() {
      return this.disabled || this.readonly;
    },
    emptyValue() {
      return this.multiple ? [] : '';
    },
    enumOptions() {
      return this.options.enumOptions || [];
    },
    enumDisabled() {
      return this.options.enumDisabled || [];
    }
  },
  methods: {
    isOptionDisabled(value) {
      return this.enumDisabled.indexOf(value) != -1;
    },
    handleBlur(event) {
      this.$emit('blur', this.id, this.getProcessedValue(event));
    },
    handleChange(event) {
      this.$emit('change', this.getProcessedValue(event));
    },
    handleFocus(event) {
      this.$emit('focus', this.id, this.getProcessedValue(event));
    },
    getProcessedValue(event) {
      const newValue = getValue(event, this.multiple);
      return processValue(this.schema, newValue);
    }
  }
};
</script>
