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
    }
  }
};

function generateRowId() {
  return shortid.generate();
}
</script>
