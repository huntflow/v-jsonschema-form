<template>
  <component
    :is="fieldTemplateCls"
    :id="id"
    :can-add="canAdd"
    class="field field-array"
    :class="'field-array-of-' + itemsSchema.type"
    :disabled="disabled"
    :ui-schema="uiSchema"
    :readonly="readonly"
    :required="required"
    :schema="schema"
    :form-data="formData"
    :registry="registry"
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
      :registry="registry"
      :index="index"
      :can-remove="true"
      :can-move-up="index > 0"
      :can-move-down="index < formData.length - 1"
      :item-schema="resolvedSchema.items"
      :item-ui-schema="uiSchema.items"
      :errors="errors[index]"
      :item-data="keyedItem.item"
      :autofocus="autofocus && index === 0"
      v-on="arrayFieldItemEvents"
    />
  </component>
</template>

<script>
import pick from 'lodash/pick';
import { canAddArrayItem } from '../../helpers/can-add-array-item';
import ArrayFieldItem from './ArrayField.Item';
import DefaultNormalArrayFieldTemplate from './ArrayField.NormalArray.DefaultTemplate';

const PROPS = {
  name: String,
  label: String,
  description: String,
  id: String,
  keyedFormData: Array,
  schema: Object,
  uiSchema: Object,
  formData: Array,
  errors: { type: Array, default: () => [] },
  registry: { type: Object, required: true },
  autofocus: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
};

export default {
  name: 'ArrayFieldNormalArray',
  inject: ['resolveSchemaShallowly'],
  components: {
    'array-field-item': ArrayFieldItem
  },
  props: PROPS,
  computed: {
    arrayFieldItemEvents() {
      return pick(this.$listeners, ['focus', 'blur', 'change-for-index', 'reorder', 'drop']);
    },
    resolvedSchema() {
      return this.resolveSchemaShallowly(this.schema, this.formData);
    },
    canAdd() {
      return canAddArrayItem(this.uiSchema, this.resolvedSchema, this.formData);
    },
    fieldTemplateCls() {
      return this.uiSchema['ui:ArrayFieldTemplate'] || DefaultNormalArrayFieldTemplate;
    },
    itemsSchema() {
      return this.resolveSchemaShallowly(this.resolvedSchema.items, this.formData);
    }
  }
};
</script>
