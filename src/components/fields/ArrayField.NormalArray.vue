<template>
  <component
    :is="fieldTemplateCls"
    :can-add="canAdd"
    class="field field-array"
    :class="'field-array-of-' + itemsSchema.type"
    :disabled="disabled"
    :id-schema="idSchema"
    :ui-schema="uiSchema"
    :on-add-click="onAddClick"
    :readonly="readonly"
    :required="required"
    :schema="schema"
    :form-data="formData"
    :raw-errors="rawErrors"
    :raw-error-infos="rawErrorInfos"
    :registry="registry"
  >
    <component
      :is="registry.fields.TitleField"
      v-if="title"
      :id="idSchema.$id + '__title'"
      v-slot:title
      :title="title"
      :required="required"
    />

    <component
      :is="registry.fields.DescriptionField"
      v-if="description"
      :id="idSchema.$id + '__description'"
      v-slot:description
      :description="description"
    />

    <array-field-item
      v-for="(keyedItem, index) in keyedFormData"
      :key="keyedItem.key"
      :registry="registry"
      :index="index"
      :can-remove="true"
      :can-move-up="index > 0"
      :can-move-down="index < formData.length - 1"
      :item-schema="getItemSchema(keyedItem.item)"
      :item-id-schema="getItemIdSchema(keyedItem.item, index)"
      :item-ui-schema="uiSchema.items"
      :item-error-schema="errorSchema ? errorSchema[index] : undefined"
      :item-data="keyedItem.item"
      :autofocus="autofocus && index === 0"
      :on-blur="onBlur"
      :on-focus="onFocus"
      :on-change-for-index="onChangeForIndex"
      :on-reorder-click="onReorderClick"
      :on-drop-index-click="onDropIndexClick"
    />
  </component>
</template>

<script>
import { getUiOptions, retrieveSchema, toIdSchema, getDefaultRegistry } from '../../utils';

import ArrayFieldItem from './ArrayField.Item';
import DefaultNormalArrayFieldTemplate from './ArrayField.NormalArray.DefaultTemplate';

const PROPS = {
  name: String,
  idPrefix: String,
  keyedFormData: Array,
  schema: Object,
  uiSchema: Object,
  formData: Array,
  errorSchema: Object,
  idSchema: Object,
  rawErrors: Array,
  rawErrorInfos: Array,
  registry: { type: Object, default: () => getDefaultRegistry() },
  autofocus: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  onBlur: Function,
  onFocus: Function,
  onAddClick: Function,
  onChangeForIndex: Function,
  onReorderClick: Function,
  onDropIndexClick: Function
};

export default {
  components: {
    'array-field-item': ArrayFieldItem
  },
  props: PROPS,
  computed: {
    title() {
      return this.schema.title === undefined ? this.name : this.schema.title;
    },
    description() {
      return this.uiSchema['ui:description'] || this.schema.description;
    },
    canAdd() {
      let { addable } = getUiOptions(this.uiSchema);
      if (addable !== false) {
        // if ui:options.addable was not explicitly set to false, we can add
        // another item if we have not exceeded maxItems yet
        if (this.schema.maxItems !== undefined) {
          addable = this.formData.length < this.schema.maxItems;
        } else {
          addable = true;
        }
      }
      return addable;
    },
    fieldTemplateCls() {
      return (
        this.uiSchema['ui:ArrayFieldTemplate'] ||
        this.registry.ArrayFieldTemplate ||
        DefaultNormalArrayFieldTemplate
      );
    },
    itemsSchema() {
      return retrieveSchema(this.schema.items);
    }
  },
  methods: {
    getItemSchema(item) {
      return retrieveSchema(this.schema.items, item);
    },
    getItemErrorSchema(index) {
      return this.errorSchema ? this.errorSchema[index] : undefined;
    },
    getItemIdSchema(item, index) {
      const itemIdPrefix = this.idSchema.$id + '_' + index;
      return toIdSchema(this.getItemSchema(item), itemIdPrefix, item, this.idPrefix);
    }
  }
};
</script>
