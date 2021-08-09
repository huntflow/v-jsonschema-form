<template>
  <fieldset :id="id">
    <component
      :is="titleFieldCls"
      v-if="label"
      :id="fieldTitleId"
      :required="required"
      :title="label"
    />
    <component
      :is="descriptionFieldCls"
      v-if="description"
      :id="fieldDescriptionId"
      :description="description"
    />
    <slot v-for="name in orderedProperties" :name="name" />
    <div v-if="canExpand">
      <add-button class="object-property-expand" :disabled="isDisabled" @click="$emit('add')" />
    </div>
  </fieldset>
</template>

<script>
import AddButton from '../AddButton';
import { getUiOptions } from '../../utils';

const PROPS = {
  id: String,
  label: String,
  description: String,
  titleFieldCls: Object,
  descriptionFieldCls: Object,
  formData: [String, Number, Boolean, Array, Object], // TODO: check if it's true
  idSchema: Object,
  schema: Object,
  uiSchema: Object,
  orderedProperties: { type: Array, required: true },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
};

export default {
  name: 'ObjectFieldDefaultTemplate',
  components: {
    'add-button': AddButton
  },
  inheritAttrs: false,
  props: PROPS,
  computed: {
    isDisabled() {
      return this.disabled || this.readonly;
    },
    fieldTitleId() {
      return this.idSchema.$id + '__title';
    },
    fieldDescriptionId() {
      return this.idSchema.$id + '__description';
    },
    canExpand() {
      if (!this.schema.additionalProperties) {
        return false;
      }
      const { expandable } = getUiOptions(this.uiSchema);
      if (expandable === false) {
        return expandable;
      }
      // if ui:options.expandable was not explicitly set to false, we can add
      // another property if we have not exceeded maxProperties yet
      if (this.schema.maxProperties !== undefined) {
        return Object.keys(this.formData).length < this.schema.maxProperties;
      }
      return true;
    }
  }
};
</script>
