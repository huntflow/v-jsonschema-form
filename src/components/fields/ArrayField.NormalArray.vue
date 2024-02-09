<template>
  <component
    v-if="widgetCls"
    :is="widgetCls"
    :id="id"
    :options="widgetWithOptions.options"
    :schema="schema"
    :registry="registry"
    :value="formData"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :label="label"
    :description="description"
    :autofocus="autofocus"
    :raw-error-infos="errors"
    :pointer="pointer"
    v-on="$listeners"
  />
  <component
    v-else
    :is="fieldTemplateCls"
    :id="id"
    :can-add="canAdd"
    class="field field-array"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :registry="registry"
    :raw-error-infos="errors"
    :pointer="pointer"
    :schema="schema"
    :ui-schema="uiSchema"
    :form-data="formData"
    @add="$emit('add')"
    @change="$emit('change', $event)"
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
      :total-count="formData.length"
      :can-remove="true"
      :can-move-up="index > 0"
      :can-move-down="index < formData.length - 1"
      :ui-schema="uiSchema"
      :item-schema="schema.items"
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
import { getWidget, getUiOptions } from '../../utils';
import { canAddArrayItem } from '../../helpers/can-add-array-item';
import ArrayFieldItem from './ArrayField.Item';
import DefaultNormalArrayFieldTemplate from './ArrayField.NormalArray.DefaultTemplate';

const PROPS = {
  name: String,
  label: String,
  description: String,
  id: String,
  pointer: {
    type: String,
    required: true
  },
  formData: {
    type: Array,
    required: true
  },
  keyedFormData: Array,
  schema: Object,
  uiSchema: Object,
  errors: { type: Array, default: () => [] },
  registry: { type: Object, required: true },
  autofocus: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
};

export default {
  name: 'ArrayFieldNormalArray',
  components: {
    'array-field-item': ArrayFieldItem
  },
  props: PROPS,
  computed: {
    widgetCls() {
      const widgetCls = this.widgetWithOptions.widget && getWidget(this.schema, this.widgetWithOptions.widget, this.registry.widgets);
      return widgetCls;
    },
    widgetWithOptions() {
      const { widget, ...options } = getUiOptions(this.uiSchema);
      return { widget, options };
    },
    arrayFieldItemEvents() {
      return pick(this.$listeners, ['focus', 'blur', 'reorder', 'drop']);
    },
    canAdd() {
      return canAddArrayItem(this.uiSchema, this.schema, this.formData);
    },
    fieldTemplateCls() {
      return this.uiSchema['ui:ArrayFieldTemplate'] || DefaultNormalArrayFieldTemplate;
    }
  }
};
</script>
