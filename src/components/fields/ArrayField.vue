<template>
  <fixed-array
    v-if="isFixedArray"
    :id="id"
    :label="label"
    :description="description"
    :keyed-form-data="keyedFormData"
    :schema="resolvedSchema"
    :ui-schema="uiSchema"
    :form-data="formData"
    :errors="errors"
    :name="name"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :autofocus="autofocus"
    :registry="registry"
    @change-for-index="handleChangeForIndex"
    @add="handleAddClick"
    @reorder="handleReorderClick"
    @drop="handleDropIndexClick"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  />

  <multiselect-array
    v-else-if="isMultiSelectArray"
    :id="id"
    :label="label"
    :description="description"
    :schema="resolvedSchema"
    :ui-schema="uiSchema"
    :form-data="formData"
    :errors="errors"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :autofocus="autofocus"
    :registry="registry"
    @reorder="handleReorderClick"
    @change="$emit('change', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  />

  <normal-array
    v-else
    :id="id"
    :label="label"
    :description="description"
    :keyed-form-data="keyedFormData"
    :schema="resolvedSchema"
    :ui-schema="uiSchema"
    :form-data="formData"
    :errors="errors"
    :name="name"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :autofocus="autofocus"
    :registry="registry"
    @change-for-index="handleChangeForIndex"
    @add="handleAddClick"
    @reorder="handleReorderClick"
    @drop="handleDropIndexClick"
    @change="$emit('change', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  />
</template>

<script>
import shortid from 'shortid';
import NormalArray from './ArrayField.NormalArray';
import FixedArray from './ArrayField.FixedArray';
import MultiSelect from './ArrayField.MultiSelect';
import { isMultiSelect, isFixedItems, allowAdditionalItems } from '../../utils';

const PROPS = {
  label: String,
  description: String,
  name: String,
  id: String,
  uiSchema: { type: Object, default: () => ({}) },
  formData: { type: Array, default: () => [] },
  schema: Object,
  errors: { type: Array, default: () => [] },
  registry: { type: Object, required: true },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false }
};

export default {
  name: 'ArrayField',
  components: {
    'normal-array': NormalArray,
    'fixed-array': FixedArray,
    'multiselect-array': MultiSelect
  },
  inject: ['resolveSchemaShallowly'],
  inheritAttrs: false,
  props: PROPS,
  emits: ['change', 'blur', 'focus'],
  data() {
    return {
      keyedFormData: [],
      updatedKeyedFormData: false
    };
  },
  computed: {
    resolvedSchema() {
      return this.resolveSchemaShallowly(this.schema, this.formData);
    },
    isFixedArray() {
      return isFixedItems(this.resolvedSchema);
    },
    isMultiSelectArray() {
      return isMultiSelect(this.resolvedSchema, this.formData);
    }
  },
  watch: {
    $props: {
      handler(newProps) {
        if (this.updatedKeyedFormData) {
          this.updatedKeyedFormData = false;
          return;
        }

        const nextFormData = newProps.formData ?? [];
        const previousKeyedFormData = this.keyedFormData;
        const newKeyedFormData =
          nextFormData.length === previousKeyedFormData.length
            ? previousKeyedFormData.map((previousKeyedFormDatum, index) => {
                return {
                  key: previousKeyedFormDatum.key,
                  item: nextFormData[index]
                };
              })
            : generateKeyedFormData(nextFormData);

        this.keyedFormData = newKeyedFormData;
      },
      deep: true, // TODO: check if it's really needed
      immediate: true
    }
  },
  methods: {
    getNewFormDataRow() {
      let itemSchema = this.resolvedSchema.items;
      if (this.isFixedArray && allowAdditionalItems(this.resolvedSchema)) {
        itemSchema = this.resolvedSchema.additionalItems;
      }
      return itemSchema.default;
    },

    handleAddClick() {
      const newKeyedFormDataRow = {
        key: generateRowId(),
        item: this.getNewFormDataRow()
      };
      const newKeyedFormData = [...this.keyedFormData, newKeyedFormDataRow];
      this.keyedFormData = newKeyedFormData;
      this.updatedKeyedFormData = true;
      this.$emit('change', keyedToPlainFormData(newKeyedFormData));
    },

    handleChangeForIndex(index, value) {
      const newFormData = (this.formData ?? []).map((item, i) => {
        // We need to treat undefined items as nulls to have validation.
        // See https://github.com/tdegrunt/jsonschema/issues/206
        const jsonValue = typeof value === 'undefined' ? null : value;
        return index === i ? jsonValue : item;
      });

      this.$emit('change', newFormData);
    },

    handleDropIndexClick(index) {
      const newKeyedFormData = this.keyedFormData.filter((_, i) => i !== index);
      this.keyedFormData = newKeyedFormData;
      this.updatedKeyedFormData = true;
      this.$emit('change', keyedToPlainFormData(newKeyedFormData));
    },

    handleReorderClick(index, newIndex) {
      const reOrderArray = () => {
        // Copy item
        let _newKeyedFormData = this.keyedFormData.slice();

        // Moves item from index to newIndex
        _newKeyedFormData.splice(index, 1);
        _newKeyedFormData.splice(newIndex, 0, this.keyedFormData[index]);
        return _newKeyedFormData;
      };

      const newKeyedFormData = reOrderArray();
      this.keyedFormData = newKeyedFormData;
      this.$emit('change', keyedToPlainFormData(newKeyedFormData));
    }
  }
};

function generateRowId() {
  return shortid.generate();
}

function generateKeyedFormData(formData) {
  return !Array.isArray(formData)
    ? []
    : formData.map((item) => {
        return {
          key: generateRowId(),
          item
        };
      });
}

function keyedToPlainFormData(keyedFormData) {
  return keyedFormData.map((keyedItem) => keyedItem.item);
}
</script>
