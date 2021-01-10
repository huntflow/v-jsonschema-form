<template>
  <component
    :is="fieldTemplateCls"
    :id="idSchema.$id"
    class="form-group field"
    :class="cssClass"
    :disabled="isDisabled"
    :hidden="isHidden"
    :label="label"
    :readonly="isReadOnly"
    :required="required"
    :schema="retrivedSchema"
  >
    <component
      :is="fieldCls"
      :name="name"
      :autofocus="hasAutofocus"
      :disabled="isDisabled"
      :error-schema="fieldErrorSchema"
      :form-data="formData"
      :id-prefix="idPrefix"
      :id-schema="mergedIdSchema"
      :raw-errors="errorSchema.__errors"
      :raw-error-infos="errorSchema.__errorInfos"
      :readonly="isReadOnly"
      :registry="registry"
      :required="required"
      :schema="retrivedSchema"
      :ui-schema="{ ...uiSchema, class: undefined }"
      :was-property-key-modified="wasPropertyKeyModified"
      :on-blur="onBlur"
      :on-change="onChange"
      :on-drop-property-click="onDropPropertyClick"
      :on-focus="onFocus"
      :on-key-change="onKeyChange"
    />

    <component
      :is="registry.fields.AnyOfField"
      v-if="isAnyOf"
      :disabled="disabled"
      :error-schema="errorSchema"
      :form-data="formData"
      :id-prefix="idPrefix"
      :id-schema="idSchema"
      :on-blur="onBlur"
      :on-change="onChange"
      :on-focus="onFocus"
      :options="retrivedSchema.anyOf"
      :base-type="retrivedSchema.type"
      :registry="registry"
      :schema="retrivedSchema"
      :ui-schema="uiSchema"
    />

    <component
      :is="registry.fields.OneOfField"
      v-if="isOneOf"
      :disabled="disabled"
      :error-schema="errorSchema"
      :form-data="formData"
      :id-prefix="idPrefix"
      :id-schema="idSchema"
      :on-blur="onBlur"
      :on-change="onChange"
      :on-focus="onFocus"
      :options="retrivedSchema.oneOf"
      :base-type="retrivedSchema.type"
      :registry="registry"
      :schema="retrivedSchema"
      :ui-schema="uiSchema"
    />
  </component>
</template>

<script>
import {
  isSelect,
  isMultiSelect,
  retrieveSchema,
  toIdSchema,
  getDefaultRegistry,
  mergeObjects,
  getUiOptions,
  isFilesArray,
  getSchemaType
} from '../../utils';

import DefaultTemplate from './SchemaField.DefaultTemplate.vue';

const PROPS = {
  name: String,
  idPrefix: String,
  schema: Object,
  idSchema: { type: Object, default: () => ({}) },
  uiSchema: { type: Object, default: () => ({}) },
  errorSchema: { type: Object, default: () => ({}) },
  formData: [String, Number, Boolean, Array, Object],
  registry: { type: Object, default: () => getDefaultRegistry() },
  wasPropertyKeyModified: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
  onKeyChange: Function,
  onDropPropertyClick: Function,
  onChange: Function,
  onFocus: Function,
  onBlur: Function
};

export default {
  props: PROPS,
  computed: {
    cssClass() {
      return {}; // TODO: классы ошибки навяливаются внутри компонент

      const hasErrors = this.errors && this.errors.length > 0;
      return {
        [this.uiSchema.classNames]: Boolean(this.uiSchema.classNames),
        'field-error has-error form-group_invalid has-danger': hasErrors
      };
    },
    isAnyOf() {
      return this.schema.anyOf && !isSelect(this.schema);
    },
    isOneOf() {
      return this.schema.oneOf && !isSelect(this.schema);
    },
    hasAutofocus() {
      return Boolean(this.autofocus || this.uiSchema['ui:autofocus']);
    },
    fieldErrorSchema() {
      // eslint-disable-next-line no-unused-vars
      const { __errors, ...fieldErrorSchema } = this.errorSchema;
      return fieldErrorSchema;
    },
    mergedIdSchema() {
      return mergeObjects(
        toIdSchema(this.retrivedSchema, null, this.formData, this.idPrefix),
        this.idSchema
      );
    },
    retrivedSchema() {
      return retrieveSchema(this.schema, this.formData);
    },
    isHidden() {
      return this.uiSchema['ui:widget'] === 'hidden';
    },
    isDisabled() {
      return this.disabled || this.uiSchema['ui:disabled'];
    },
    isReadOnly() {
      return Boolean(
        this.readonly ||
          this.uiSchema['ui:readonly'] ||
          this.schema.readOnly ||
          this.retrivedSchema.readOnly
      );
    },
    label() {
      // If this schema has a title defined, but the user has set a new key/label, retain their input.
      if (this.wasPropertyKeyModified) {
        return this.name;
      }
      return (
        this.uiSchema['ui:title'] || this.schema.title || this.retrivedSchema.title || this.name
      );
    },
    description() {
      return (
        this.uiSchema['ui:description'] ||
        this.schema.description ||
        this.retrivedSchema.description
      );
    },
    errors() {
      return (this.errorSchema.__errors || []).filter(Boolean);
    },
    fieldCls() {
      return getFieldComponent(
        this.retrivedSchema,
        this.uiSchema,
        this.mergedIdSchema,
        this.registry.fields
      );
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

function getFieldComponent(schema, uiSchema, idSchema, fields) {
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
