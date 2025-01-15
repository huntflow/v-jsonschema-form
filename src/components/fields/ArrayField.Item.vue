<template>
  <component
    :is="fieldTemplateCls"
    class="array-item"
    :index="index"
    :disabled="disabled"
    :readonly="readonly"
    :pointer="pointer"
  >
    <component
      :is="registry.fields.SchemaField"
      :id="id"
      :name="`${index}`"
      :pointer="pointer"
      :form-data="itemData"
      :schema="resolvedSchema"
      :ui-schema="itemUiSchema"
      :error-schema="errorSchema"
      :required="isRequired"
      :registry="registry"
      :disabled="disabled"
      :readonly="readonly"
      :autofocus="autofocus"
    />
  </component>
</template>

<script>
import DefaultArrayItem from './ArrayField.DefaultArrayItem';

const PROPS = {
  index: Number,
  itemSchema: Object,
  itemData: {},
  itemUiSchema: Object,
  id: String,
  pointer: {
    type: String,
    required: true
  },
  errorSchema: Object,
  uiSchema: { type: Object },
  registry: { type: Object, required: true },
  autofocus: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
};

export default {
  name: 'ArrayFieldItem',
  compatConfig: {
    MODE: 3
  },
  components: {
    'default-array-item': DefaultArrayItem
  },
  inject: ['resolveSchemaShallowly'],
  props: PROPS,
  computed: {
    fieldTemplateCls() {
      return this.itemUiSchema?.['ui:ArrayItemFieldTemplate'] || DefaultArrayItem;
    },
    resolvedSchema() {
      return this.resolveSchemaShallowly(this.itemSchema, this.itemData);
    },
    isRequired() {
      if (Array.isArray(this.resolvedSchema.type)) {
        // While we don't yet support composite/nullable jsonschema types, it's
        // future-proof to check for requirement against these.
        return this.resolvedSchema.type.includes('null') === false;
      }
      // All non-null array item types are inherently required by design
      return this.resolvedSchema.type !== 'null';
    }
  }
};
</script>
