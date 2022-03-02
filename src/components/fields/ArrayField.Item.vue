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
      :schema="itemSchema"
      :ui-schema="itemUiSchema"
      :form-data="itemData"
      :error-schema="itemErrorSchema"
      :required="isRequired"
      :registry="registry"
      :disabled="disabled"
      :readonly="readonly"
      :autofocus="autofocus"
      :raw-errors="rawErrors"
      :raw-error-infos="rawErrorInfos"
      v-on="schemaFieldEventListeners"
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
  itemErrorSchema: Object,
  rawErrors: { type: Array },
  rawErrorInfos: { type: Array },
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
  props: PROPS,
  computed: {
    arrayItemEventListeners() {
      return pick(this.$listeners, ['drop', 'reorder']);
    },
    schemaFieldEventListeners() {
      return pick(this.$listeners, ['blur', 'focus']);
    },
    isRequired() {
      if (Array.isArray(this.itemSchema.type)) {
        // While we don't yet support composite/nullable jsonschema types, it's
        // future-proof to check for requirement against these.
        return this.itemSchema.type.includes('null') === false;
      }
      // All non-null array item types are inherently required by design
      return this.itemSchema.type !== 'null';
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
