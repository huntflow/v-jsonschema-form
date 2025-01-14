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
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :form-data="formData"
    :pointer="pointer"
  >
    <template v-for="propName in orderedProperties" #[propName]="scopedProps">
      <component
        :is="schemaFieldCls"
        :id="`${id}_${propName}`"
        :key="propName"
        :pointer="`${pointer}/${propName}`"
        :form-data="formData[propName]"
        :name="propName"
        :required="isRequired(propName)"
        :schema="resolvedSchema.properties[propName]"
        :ui-schema="scopedProps.uiSchema || uiSchema[propName]"
        :error-schema="(errorSchema || {})[propName]"
        :registry="registry"
        :disabled="disabled"
        :readonly="readonly"
        v-bind="scopedProps"
      />
    </template>
  </component>
</template>

<script>
import DefaultObjectFieldTemplate from './ObjectField.DefaultTemplate.vue';
import { orderProperties } from '../../utils';

const PROPS = {
  name: String,
  label: String,
  description: String,
  uiSchema: { type: Object, default: () => ({}) },
  id: String,
  pointer: {
    type: String,
    required: true
  },
  formData: {
    type: Object,
    required: true
  },
  errorSchema: { type: Object, default: () => ({}) },
  schema: Object,
  registry: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
};

export default {
  name: 'ObjectField',
  inject: ['resolveSchemaShallowly'],
  props: PROPS,
  computed: {
    resolvedSchema() {
      return this.resolveSchemaShallowly(this.schema, this.formData);
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
