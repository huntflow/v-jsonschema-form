<template>
  <default-array-item
    class="array-item"
    :index="index"
    :has-move-up="has.moveUp"
    :has-move-down="has.moveDown"
    :has-remove="has.remove"
    :has-toolbar="has.toolbar"
    :disabled="disabled"
    :readonly="readonly"
    v-on="arrayItemEventListeners"
  >
    <component
      :is="registry.fields.SchemaField"
      :id="id"
      :name="`${index}`"
      :pointer="pointer"
      :form-data="itemData"
      :schema="resolvedSchema"
      :ui-schema="itemUiSchema"
      :errors="errors"
      :required="isRequired"
      :registry="registry"
      :disabled="disabled"
      :readonly="readonly"
      :autofocus="autofocus"
      v-on="schemaFieldEventListeners"
    />
  </default-array-item>
</template>

<script>
import pick from 'lodash/pick';
import DefaultArrayItem from './ArrayField.DefaultArrayItem';

const PROPS = {
  index: Number,
  canRemove: { default: true },
  canMoveUp: { default: true },
  canMoveDown: { default: true },
  itemSchema: Object,
  itemData: {},
  itemUiSchema: Object,
  id: String,
  pointer: {
    type: String,
    required: true
  },
  errors: Object,
  uiSchema: { type: Object },
  registry: { type: Object, required: true },
  autofocus: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
};

export default {
  name: 'ArrayFieldItem',
  components: {
    'default-array-item': DefaultArrayItem
  },
  inject: ['resolveSchemaShallowly'],
  props: PROPS,
  computed: {
    resolvedSchema() {
      return this.resolveSchemaShallowly(this.itemSchema, this.itemData);
    },
    arrayItemEventListeners() {
      return pick(this.$listeners, ['drop', 'reorder']);
    },
    schemaFieldEventListeners() {
      return pick(this.$listeners, ['blur', 'focus']);
    },
    isRequired() {
      if (Array.isArray(this.resolvedSchema.type)) {
        // While we don't yet support composite/nullable jsonschema types, it's
        // future-proof to check for requirement against these.
        return this.resolvedSchema.type.includes('null') === false;
      }
      // All non-null array item types are inherently required by design
      return this.resolvedSchema.type !== 'null';
    },
    has() {
      const { orderable, removable } = {
        orderable: true,
        removable: true,
        ...(this.uiSchema || {})['ui:options']
      };
      const result = {
        moveUp: orderable && this.canMoveUp,
        moveDown: orderable && this.canMoveDown,
        remove: removable && this.canRemove
      };
      result.toolbar = Object.keys(result).some((key) => result[key]);

      return result;
    }
  }
};
</script>
