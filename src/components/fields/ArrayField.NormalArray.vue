<template>
  <component
    :is="fieldTemplateCls"
    :can-add="canAdd"
    class="field field-array"
    :class="'field-array-of-' + itemsSchema.type"
    :disabled="disabled"
    :id-schema="idSchema"
    :ui-schema="uiSchema"
    :readonly="readonly"
    :required="required"
    :schema="schema"
    :form-data="formData"
    :raw-errors="rawErrors"
    :raw-error-infos="rawErrorInfos"
    :registry="registry"
    @add="$emit('add')"
  >
    <template v-if="label" #title>
      <component
        :is="registry.fields.TitleField"
        :id="idSchema.$id + '__title'"
        :title="label"
        :required="required"
      />
    </template>

    <template v-if="description" #description>
      <component
        :is="registry.fields.DescriptionField"
        :id="idSchema.$id + '__description'"
        :description="description"
      />
    </template>

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
      v-on="arrayFieldItemEvents"
    />
  </component>
</template>

<script>
import pick from 'lodash/pick';
import { retrieveSchema, toIdSchema } from '../../utils';
import { canAddArrayItem } from '../../helpers/can-add-array-item';
import ArrayFieldItem from './ArrayField.Item';
import DefaultNormalArrayFieldTemplate from './ArrayField.NormalArray.DefaultTemplate';

const PROPS = {
  name: String,
  label: String,
  description: String,
  idPrefix: String,
  keyedFormData: Array,
  schema: Object,
  uiSchema: Object,
  formData: Array,
  errorSchema: Object,
  idSchema: Object,
  rawErrors: Array,
  rawErrorInfos: Array,
  registry: { type: Object, required: true },
  autofocus: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
};

export default {
  components: {
    'array-field-item': ArrayFieldItem
  },
  props: PROPS,
  computed: {
    arrayFieldItemEvents() {
      return pick(this.$listeners, ['focus', 'blur', 'change-for-index', 'reorder', 'drop']);
    },
    canAdd() {
      return canAddArrayItem(this.uiSchema, this.schema, this.formData);
    },
    fieldTemplateCls() {
      return this.uiSchema['ui:ArrayFieldTemplate'] || DefaultNormalArrayFieldTemplate;
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
