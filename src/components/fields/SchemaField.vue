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
      :error-schema="fieldErrorSchema"
      :form-data="formData"
      :raw-errors="errorSchema.__errors"
      :raw-error-infos="errorSchema.__errorInfos"
      :readonly="isReadOnly"
      :registry="registry"
      :required="required"
      :schema="resolvedSchema"
      :ui-schema="{ ...uiSchema, class: undefined }"
      :was-property-key-modified="wasPropertyKeyModified"
      v-on="fieldEventListeners"
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
  errorSchema: { type: Object, default: () => ({}) },
  formData: [String, Number, Boolean, Array, Object],
  registry: { type: Object, required: true },
  wasPropertyKeyModified: { type: Boolean, default: false },
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
    fieldEventListeners() {
      return pick(this.$listeners, ['drop-property', 'key-change', 'focus', 'blur', 'change']);
    },
    hasAutofocus() {
      return Boolean(this.autofocus || this.uiSchema['ui:autofocus']);
    },
    fieldErrorSchema() {
      // eslint-disable-next-line no-unused-vars
      const { __errors, ...fieldErrorSchema } = this.errorSchema;
      return fieldErrorSchema;
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
      // If this schema has a title defined, but the user has set a new key/label, retain their input.
      if (this.wasPropertyKeyModified) {
        return this.name;
      }
      return (
        this.uiSchema['ui:title'] ?? this.resolvedSchema.title ?? '' // this.name
      );
    },
    description() {
      return this.uiSchema['ui:description'] || this.resolvedSchema.description;
    },
    errors() {
      return (this.errorSchema.__errors || []).filter(Boolean);
    },
    fieldCls() {
      return getFieldComponent(this.resolvedSchema, this.uiSchema, this.registry.fields);
    },
    fieldTemplateCls() {
      return this.uiSchema['ui:FieldTemplate'] || this.registry.FieldTemplate || DefaultTemplate;
    }
  },
  methods: {
    handleEvent(event, ...args) {
      this.$emit(event, ...args);
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
