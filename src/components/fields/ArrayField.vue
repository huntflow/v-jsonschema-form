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
    :error-schema="errorSchema"
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
    :error-schema="errorSchema"
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
    @change="$emit('change', $event)"
  />
</template>

<script>
import shortid from 'shortid';

import NormalArray from './ArrayField.NormalArray';
import FixedArray from './ArrayField.FixedArray';
import { isFixedItems, allowAdditionalItems } from '../../utils';

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
  errorSchema: { type: Array, default: () => [] },
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
    FixedArray
  },
  inject: ['resolveSchemaShallowly'],
  inheritAttrs: false,
  props: PROPS,
  emits: ['focus', 'blur', 'change'],
  data() {
    return {
      keys: []
    };
  },
  computed: {
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
