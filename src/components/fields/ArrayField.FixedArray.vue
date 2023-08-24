<template>
  <component
    :is="fieldTemplateCls"
    :id="id"
    :schema="schema"
    :ui-schema="uiSchema"
    :can-add="canAdd"
    :disabled="disabled"
    :readonly="readonly"
    class="field field-array field-array-fixed-items"
    @add="$emit('add')"
  >
    <template v-if="label" #title>
      <component
        :is="registry.fields.TitleField"
        :id="id + '__title'"
        :title="label"
        :required="required"
      />
    </template>

    <template v-if="description" #description>
      <component
        :is="registry.fields.DescriptionField"
        :id="id + '__description'"
        :description="description"
      />
    </template>

    <array-field-item
      v-for="(keyedItem, index) in keyedFormData"
      :id="`${id}_${index}`"
      :key="keyedItem.key"
      :pointer="`${pointer}/${index}`"
      :registry="registry"
      :index="index"
      :can-remove="index >= itemSchemas.length"
      :can-move-up="index >= itemSchemas.length + 1"
      :can-move-down="index >= itemSchemas.length && index < formDataItems.length - 1"
      :ui-schema="uiSchema"
      :item-schema="getItemSchema(keyedItem.item, index)"
      :item-ui-schema="getItemUiSchema(index)"
      :item-data="keyedItem.item"
      :errors="errors[index]"
      :autofocus="autofocus && index === 0"
      v-on="arrayFieldItemEventListeners"
    />
  </component>
</template>

<script>
import pick from 'lodash/pick';

import { canAddArrayItem } from '../../helpers/can-add-array-item';
import ArrayFieldItem from './ArrayField.Item';
import DefaultFixedArrayFieldTemplate from './ArrayField.FixedArray.DefaultTemplate';

const PROPS = {
  name: String,
  keyedFormData: Array,
  schema: Object,
  uiSchema: {},
  errors: { type: Array, default: () => [] },
  id: String,
  pointer: {
    type: String,
    required: true
  },
  formData: {
    type: Array,
    required: true
  },
  registry: { type: Object, required: true },
  autofocus: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  label: { type: String },
  description: { type: String }
};

export default {
  name: 'ArrayFieldFixedArray',
  inject: ['resolveSchemaShallowly'],
  components: {
    ArrayFieldItem
  },
  props: PROPS,
  computed: {
    arrayFieldItemEventListeners() {
      return pick(this.$listeners, ['focus', 'blur', 'reorder', 'drop']);
    },
    canAdd() {
      return canAddArrayItem(this.uiSchema, this.schema, this.formData);
    },
    fieldTemplateCls() {
      return this.uiSchema['ui:ArrayFieldTemplate'] || DefaultFixedArrayFieldTemplate;
    },
    itemSchemas() {
      return this.schema.items.map((item, index) =>
        this.resolveSchemaShallowly(item, this.formData[index])
      );
    },
    formDataItems() {
      let items = this.formData;
      if (!items || items.length < this.itemSchemas.length) {
        // to make sure at least all fixed items are generated
        items = items || [];
        items = items.concat(new Array(this.itemSchemas.length - items.length));
      }
      return items;
    }
  },
  methods: {
    getItemSchema(item, index) {
      const additional = index >= this.itemSchemas.length;
      return additional ? this.schema.additionalItems : this.itemSchemas[index];
    },
    getItemUiSchema(index) {
      const additional = index >= this.itemSchemas.length;
      const itemUiSchema = additional
        ? this.uiSchema.additionalItems || {}
        : Array.isArray(this.uiSchema.items)
        ? this.uiSchema.items[index]
        : this.uiSchema.items || {};
      return itemUiSchema;
    }
  }
};
</script>
