<template>
  <component
    :is="objectFieldTemplateCls"
    :id="id"
    :label="label"
    :title-field-cls="registry.fields.TitleField"
    :description="description"
    :description-field-cls="registry.fields.DescriptionField"
    :schema="resolvedSchema"
    :ui-schema="uiSchema"
    :ordered-properties="orderedProperties"
    :form-data="formState"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
  >
    <template v-for="propName in orderedProperties" #[propName]="scopedProps">
      <component
        :is="schemaFieldCls"
        :id="`${id}_${propName}`"
        :key="propName"
        :name="propName"
        :required="isRequired(propName)"
        :schema="resolvedSchema.properties[propName]"
        :ui-schema="scopedProps.uiSchema || uiSchema[propName]"
        :errors="errors[propName]"
        :form-data="formState[propName]"
        :registry="registry"
        :disabled="disabled"
        :readonly="readonly"
        v-bind="scopedProps"
        v-on="schemaFieldEventListeners"
      />
    </template>
  </component>
</template>

<script>
import pick from 'lodash/pick';
import DefaultObjectFieldTemplate from './ObjectField.DefaultTemplate.vue';
import { orderProperties } from '../../utils';

const PROPS = {
  name: String,
  label: String,
  description: String,
  uiSchema: { type: Object, default: () => ({}) },
  id: String,
  errors: { type: Object, default: () => ({}) },
  schema: Object,
  registry: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
};

export default {
  name: 'ObjectField',
  props: PROPS,
  inject: ['resolveSchemaShallowly', 'getFormData'],
  computed: {
    formState() {
      return this.getFormData();
    },
    schemaFieldEventListeners() {
      return pick(this.$listeners, ['focus', 'blur']);
    },
    resolvedSchema() {
      return this.resolveSchemaShallowly(this.schema, this.formState);
    },
    requiredFields() {
      return this.resolvedSchema.required || [];
    },
    objectFieldTemplateCls() {
      return this.uiSchema['ui:ObjectFieldTemplate'] || DefaultObjectFieldTemplate;
    },
    schemaFieldCls() {
      return this.registry.fields.SchemaField;
    },
    orderedProperties() {
      const properties = Object.keys(this.resolvedSchema.properties || {});
      return orderProperties(properties, this.uiSchema['ui:order']);
    }
  },
  methods: {
    isRequired(name) {
      return this.requiredFields.includes(name);
    }
  }
};
</script>
