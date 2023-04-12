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
  >
    <component
      :is="fieldCls"
      :id="id"
      :name="name"
      :label="title"
      :description="description"
      :autofocus="hasAutofocus"
      :disabled="isDisabled"
      :errors="errors"
      :form-data="formData"
      :readonly="isReadOnly"
      :registry="registry"
      :required="required"
      :schema="resolvedSchema"
      :ui-schema="{ ...uiSchema, class: undefined }"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @change="$emit('change', $event)"
    />
  </component>
</template>

<script>
import pick from 'lodash/pick';
import { getSchemaType } from '../../utils';

import DefaultTemplate from './SchemaField.DefaultTemplate.vue';

const PROPS = {
  name: String,
  id: String,
  schema: Object,
  uiSchema: { type: Object, default: () => ({}) },
  errors: { type: [Array, Object] },
  formData: [String, Number, Boolean, Array, Object],
  registry: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false }
};

export default {
  name: 'SchemaField',
  props: PROPS,
  inject: ['resolveSchemaShallowly'],
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
      return this.uiSchema['ui:FieldTemplate'] || this.registry.FieldTemplate || DefaultTemplate;
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
