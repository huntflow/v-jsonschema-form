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
    :form-data="innerFormData"
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
        :form-data="(innerFormData || {})[propName]"
        :registry="registry"
        :disabled="disabled"
        :readonly="readonly"
        v-bind="scopedProps"
	@focus="$emit('focus', $event)"
	@blur="$emit('blur', $event)"
        @change="handlePropertyChange(propName, ...arguments)"
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
  formData: {
    type: [String, Number, Boolean, Array, Object], // TODO: check if it's true
    default: () => ({})
  },
  schema: Object,
  registry: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
};

export default {
  name: 'ObjectField',
  emits: ['focus', 'blur', 'change'],
  props: PROPS,
  inject: ['resolveSchemaShallowly'],
  data() {
    return {
      innerFormData: {} // TODO: используется для того чтобы можно было обновить несколько вложенных полей одновременно, допустим если в инпутах заполняются данные при mounted
    };
  },
  computed: {
    resolvedSchema() {
      return this.resolveSchemaShallowly(this.schema, this.innerFormData);
    },
    requiredFields() {
      return this.resolvedSchema.required || [];
    },
    objectFieldTemplateCls() {
      return (
        this.uiSchema['ui:ObjectFieldTemplate'] ||
        this.registry.ObjectFieldTemplate ||
        DefaultObjectFieldTemplate
      );
    },
    schemaFieldCls() {
      return this.registry.fields.SchemaField;
    },
    orderedProperties() {
      const properties = Object.keys(this.resolvedSchema.properties || {});
      return orderProperties(properties, this.uiSchema['ui:order']);
    }
  },
  watch: {
    formData: {
      immediate: true,
      handler(formData) {
        this.innerFormData = formData;
      }
    }
  },
  methods: {
    isRequired(name) {
      return this.requiredFields.includes(name);
    },
    handlePropertyChange(name, value) {
      this.innerFormData[name] = value;
      this.$emit('change', { ...this.innerFormData });
    }
  }
};
</script>
