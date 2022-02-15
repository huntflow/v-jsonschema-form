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
        @focus="$emit('focus', $event)"
        @change="$emit('change', $event.target.checked)"
        @blur="$emit('blur', $event)"
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
  }
};

// Check to see if a schema specifies that a value must be true
function schemaRequiresTrueValue(schema) {
  // Check if const is a truthy value
  if (schema.const) {
    return true;
  }

  // Check if an enum has a single value of true
  return schema.enum && schema.enum.length === 1 && schema.enum[0] === true;
}
</script>
