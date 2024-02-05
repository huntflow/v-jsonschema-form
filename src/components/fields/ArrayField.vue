<template>
  <fixed-array
    v-if="isFixedArray"
    :id="id"
    :pointer="pointer"
    :form-data="formData"
    :label="label"
    :description="description"
    :keyed-form-data="keyedFormData"
    :schema="resolvedSchema"
    :ui-schema="uiSchema"
    :errors="errors"
    :name="name"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :autofocus="autofocus"
    :registry="registry"
    v-on="fixedArrayEventListeners"
    @add="handleAddClick"
    @reorder="handleReorderClick"
    @drop="handleDropIndexClick"
  />

  <multi-select-array
    v-else-if="isMultiSelectArray"
    :id="id"
    :pointer="pointer"
    :form-data="formData"
    :label="label"
    :description="description"
    :schema="resolvedSchema"
    :ui-schema="uiSchema"
    :errors="errors"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :autofocus="autofocus"
    :registry="registry"
    v-on="multiselectArrayEventListeners"
    @reorder="handleReorderClick"
  />

  <normal-array
    v-else
    :id="id"
    :pointer="pointer"
    :form-data="formData"
    :label="label"
    :description="description"
    :keyed-form-data="keyedFormData"
    :schema="resolvedSchema"
    :ui-schema="uiSchema"
    :errors="errors"
    :name="name"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :autofocus="autofocus"
    :registry="registry"
    v-on="normalArrayEventListeners"
    @add="handleAddClick"
    @reorder="handleReorderClick"
    @drop="handleDropIndexClick"
  />
</template>

<script>
import pick from 'lodash/pick';
import shortid from 'shortid';

import NormalArray from './ArrayField.NormalArray';
import FixedArray from './ArrayField.FixedArray';
import MultiSelectArray from './ArrayField.MultiSelect';
import { isMultiSelect, isFixedItems, allowAdditionalItems } from '../../utils';

const PROPS = {
  label: String,
  description: String,
  name: String,
  id: String,
  pointer: {
    type: String,
    required: true
  },
  formData: {
    type: Array,
    default: () => []
  },
  uiSchema: { type: Object, default: () => ({}) },
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
  inject: ['resolveSchemaShallowly', 'setFormDataByPointer'],
  components: {
    NormalArray,
    FixedArray,
    MultiSelectArray
  },
  inheritAttrs: false,
  props: PROPS,
  data() {
    return {
      keys: []
    };
  },
  computed: {
    fixedArrayEventListeners() {
      return pick(this.$listeners, ['blur', 'focus']);
    },
    multiselectArrayEventListeners() {
      return pick(this.$listeners, ['blur', 'focus']);
    },
    normalArrayEventListeners() {
      return pick(this.$listeners, ['blur', 'focus']);
    },
    resolvedSchema() {
      const schema = this.resolveSchemaShallowly(this.schema, this.formData);
      if (Array.isArray(schema.items)) {
        return schema;
      }
      return {
        ...schema,
        items: {
          ...schema.items,
          default: this.resolveSchemaShallowly(schema.items, this.formData?.[0]).default
        }
      };
    },
    isFixedArray() {
      return isFixedItems(this.resolvedSchema);
    },
    isMultiSelectArray() {
      return isMultiSelect(this.resolvedSchema, this.formData);
    },
    keyedFormData() {
      if (!this.formData) {
        return [];
      }
      return this.formData.map((item, index) => {
        return {
          key: this.keys[index],
          item
        };
      });
    }
  },
  created() {
    this.keys = this.formData?.map(() => generateRowId()) || [];
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
      this.keys.push(generateRowId());
      this.setFormDataByPointer(this.pointer, (state) => {
        state.push(this.getNewFormDataRow());
      });
    },

    handleDropIndexClick(index) {
      this.keys.splice(index, 1);
      this.setFormDataByPointer(this.pointer, (state) => {
        state.splice(index, 1);
      });
    },

    handleReorderClick(from, to) {
      const tempKey = this.keys[from];
      this.$set(this.keys, from, this.keys[to]);
      this.$set(this.keys, to, tempKey);

      this.setFormDataByPointer(this.pointer, (state) => {
        const temp = state[from];
        this.$set(state, from, state[to]);
        this.$set(state, to, temp);
      });
    }
  }
};

function generateRowId() {
  return shortid.generate();
}
</script>
