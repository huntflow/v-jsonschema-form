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
    @drop="$emit('drop', $event)"
    @reorder="$emit('reorder', $event)"
  >
    <component
      :is="registry.fields.SchemaField"
      :id="id"
      :schema="resolvedSchema"
      :ui-schema="itemUiSchema"
      :form-data="itemData"
      :errors="errors"
      :required="isRequired"
      :registry="registry"
      :disabled="disabled"
      :readonly="readonly"
      :autofocus="autofocus"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
      @change="handleChangeForIndex(index, ...arguments)"
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
  emits: ['change-for-index', 'drop', 'reorder', 'blur', 'focus'],
  props: PROPS,
  computed: {
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
  },
  methods: {
    handleChangeForIndex(index, ...args) {
      this.$emit('change-for-index', index, ...args);
    }
  }
};
</script>
