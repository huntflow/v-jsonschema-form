<template>
  <div class="checkbox" :class="{ disabled: isDisabled }">
    <description-field :description="schema.description" />
    <label>
      <input
        :id="id"
        type="checkbox"
        :checked="isChecked"
        :required="isRequired"
        :disabled="isDisabled"
        :autoFocus="autofocus"
        @focus="handleFocus"
        @change="handleChange"
        @blur="handleBlur"
      />
      <span>{{ label }}</span>
    </label>
  </div>
</template>

<script>
import DescriptionField from '../fields/DescriptionField';

const PROPS = {
  schema: Object,
  id: String,
  value: Boolean,
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  label: String,
  autofocus: {}
};

export default {
  components: {
    'description-field': DescriptionField
  },
  props: PROPS,
  computed: {
    isDisabled() {
      return this.disabled || this.readonly;
    },
    isChecked() {
      return typeof this.value === 'undefined' ? false : this.value;
    },
    isRequired() {
      return schemaRequiresTrueValue(this.schema);
    }
  },
  methods: {
    handleFocus() {
      this.$emit('focus', event.target.checked);
    },
    handleChange(event) {
      this.$emit('change', event.target.checked);
    },
    handleBlur() {
      this.$emit('blur', event.target.checked);
    }
  }
};

// Check to see if a schema specifies that a value must be true
function schemaRequiresTrueValue(schema) {
  // Check if const is a truthy value
  if (schema.const) {
    return true;
  }

  // Check if an enum has a single value of true
  if (schema.enum && schema.enum.length === 1 && schema.enum[0] === true) {
    return true;
  }

  // If anyOf has a single value, evaluate the subschema
  if (schema.anyOf && schema.anyOf.length === 1) {
    return schemaRequiresTrueValue(schema.anyOf[0]);
  }

  // If oneOf has a single value, evaluate the subschema
  if (schema.oneOf && schema.oneOf.length === 1) {
    return schemaRequiresTrueValue(schema.oneOf[0]);
  }

  // Evaluate each subschema in allOf, to see if one of them requires a true
  // value
  if (schema.allOf) {
    return schema.allOf.some(schemaRequiresTrueValue);
  }
}
</script>
