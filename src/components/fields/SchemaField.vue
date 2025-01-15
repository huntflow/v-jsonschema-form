<template>
  <component
    :is="fieldTemplateCls"
    :id="id"
    class="form-group field"
    :disabled="isDisabled"
    :hidden="isHidden"
    :label="title"
    :description="description"
    :readonly="isReadOnly"
    :required="required"
    :schema="resolvedSchema"
    :ui-schema="uiSchema"
    :form-data="formData"
    :pointer="pointer"
    :error-schema="errorSchema"
  >
    <component
      :is="fieldCls"
      :id="id"
      :pointer="pointer"
      :form-data="formData"
      :name="name"
      :label="title"
      :description="description"
      :autofocus="hasAutofocus"
      :disabled="isDisabled"
      :error-schema="errorSchema"
      :readonly="isReadOnly"
      :registry="registry"
      :required="required"
      :schema="resolvedSchema"
      :ui-schema="uiSchema"
    />
  </component>
</template>

<script>
import { getSchemaType } from '../../utils';
import DefaultTemplate from './SchemaField.DefaultTemplate.vue';

const PROPS = {
  name: {
    type: String,
    default: null
  },
  id: String,
  pointer: {
    type: String,
    required: true
  },
  formData: {
    type: [Number, String, Array, Object, Boolean],
    default: undefined
  },
  schema: Object,
  uiSchema: { type: Object, default: () => ({}) },
  errorSchema: { type: [Array, Object] },
  registry: { type: Object, required: true },
  disabled: Boolean,
  required: Boolean,
  readonly: Boolean,
  autofocus: Boolean
};

export default {
  name: 'SchemaField',
  compatConfig: {
    MODE: 3
  },
  inject: ['resolveSchemaShallowly'],
  props: PROPS,
  computed: {
    hasAutofocus() {
      return Boolean(this.autofocus || this.uiSchema['ui:autofocus']);
    },
    resolvedSchema() {
      return this.resolveSchemaShallowly(this.schema, this.formData);
    },
    isHidden() {
      return this.uiSchema['ui:widget'] === 'hidden';
    },
    isDisabled() {
      return this.disabled || this.uiSchema['ui:disabled'];
    },
    isReadOnly() {
      return Boolean(this.readonly || this.uiSchema['ui:readonly'] || this.resolvedSchema.readOnly);
    },
    title() {
      return this.uiSchema['ui:title'] ?? this.resolvedSchema.title ?? '';
    },
    description() {
      return this.uiSchema['ui:description'] || this.resolvedSchema.description;
    },
    fieldCls() {
      return getFieldComponent(this.resolvedSchema, this.uiSchema, this.registry.fields);
    },
    fieldTemplateCls() {
      return this.uiSchema['ui:FieldTemplate'] || DefaultTemplate;
    }
  }
};

const COMPONENT_TYPES = {
  array: 'ArrayField',
  boolean: 'BooleanField',
  integer: 'NumberField',
  number: 'NumberField',
  object: 'ObjectField',
  string: 'StringField',
  null: 'NullField'
};

function getFieldComponent(schema, uiSchema, fields) {
  const field = uiSchema['ui:field'];
  if (typeof field === 'function') {
    return field;
  }
  if (typeof field === 'string' && field in fields) {
    return fields[field];
  }
  const componentName = COMPONENT_TYPES[getSchemaType(schema)];
  return fields[componentName];
}
</script>
