<template>
  <component
    :is="objectFieldTemplateCls"
    :id="idSchema.$id"
    :label="label"
    :title-field-cls="registry.fields.TitleField"
    :description="description"
    :description-field-cls="registry.fields.DescriptionField"
    :schema="retrivedSchema"
    :id-schema="idSchema"
    :ui-schema="uiSchema"
    :ordered-properties="orderedProperties"
    :form-data="innerFormData"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    @add="handleAdd"
  >
    <template v-for="propName in orderedProperties" #[propName]="scopedProps">
      <component
        :is="schemaFieldCls"
        :key="propName"
        :name="propName"
        :required="isRequired(propName)"
        :schema="retrivedSchema.properties[propName]"
        :ui-schema="
          isAddedByAdditionalProperties(propName)
            ? uiSchema.additionalProperties
            : scopedProps.uiSchema || uiSchema[propName]
        "
        :error-schema="errorSchema[propName]"
        :id-schema="idSchema[propName]"
        :id-prefix="idPrefix"
        :form-data="(innerFormData || {})[propName]"
        :was-property-key-modified="wasPropertyKeyModified"
        :registry="registry"
        :disabled="disabled"
        :readonly="readonly"
        v-bind="scopedProps"
        v-on="schemaFieldEventListeners"
        @change="handlePropertyChange(propName, ...arguments)"
        @key-change="handleKeyChange(propName, ...arguments)"
        @drop-property="handleDropPropertyClick"
      />
    </template>
  </component>
</template>

<script>
import pick from 'lodash/pick';
import DefaultObjectFieldTemplate from './ObjectField.DefaultTemplate.vue';
import {
  orderProperties,
  retrieveSchema,
  ADDITIONAL_PROPERTY_FLAG,
  getCurrentRequired
} from '../../utils';

const PROPS = {
  name: String,
  label: String,
  description: String,
  uiSchema: { type: Object, default: () => ({}) },
  idPrefix: String,
  idSchema: { type: Object, default: () => ({}) },
  errorSchema: { type: Object, default: () => ({}) },
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
  props: PROPS,
  data() {
    return {
      wasPropertyKeyModified: false,
      additionalProperties: {},
      innerFormData: {}
    };
  },
  computed: {
    schemaFieldEventListeners() {
      return pick(this.$listeners, ['focus', 'blur']);
    },
    retrivedSchema() {
      return retrieveSchema(this.schema, this.innerFormData);
    },
    requiredFields() {
      return getCurrentRequired(this.schema, this.innerFormData);
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
      const properties = Object.keys(this.retrivedSchema.properties || {});
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
    isAddedByAdditionalProperties(name) {
      return (
        this.retrivedSchema.properties[name]
          // eslint-disable-next-line no-prototype-builtins
          .hasOwnProperty(ADDITIONAL_PROPERTY_FLAG)
      );
    },
    handleAdd() {
      const schema = this.retrievedSchema;
      let type = schema.additionalProperties.type;
      this.innerFormData[getAvailableKey('newKey', this.innerFormData)] = getDefaultValue(type);

      this.$emit('change', { ...this.innerFormData });
    },
    handlePropertyChange(name, value, errorSchema) {
      if (!value && this.isAddedByAdditionalProperties(name)) {
        // Don't set value = undefined for fields added by
        // additionalProperties. Doing so removes them from the
        // formData, which causes them to completely disappear
        // (including the input field for the property name). Unlike
        // fields which are "mandated" by the schema, these fields can
        // be set to undefined by clicking a "delete field" button, so
        // set empty values to the empty string.
        value = '';
      }

      this.innerFormData[name] = value;
      this.$emit(
        'change',
        { ...this.innerFormData },
        errorSchema &&
          this.errorSchema && {
            ...this.errorSchema,
            [name]: errorSchema
          }
      );
    },
    handleDropPropertyClick(key) {
      delete this.innerFormData[key];
      this.$emit('change', { ...this.innerFormData });
    },
    handleKeyChange(oldValue, value, errorSchema) {
      if (oldValue === value) {
        return;
      }

      value = getAvailableKey(value, this.innerFormData);
      const newFormData = { ...this.innerFormData };
      const newKeys = { [oldValue]: value };
      const keyValues = Object.keys(newFormData).map((key) => {
        const newKey = newKeys[key] || key;
        return { [newKey]: newFormData[key] };
      });
      Object.assign(this.innerFormData, ...keyValues);
      this.wasPropertyKeyModified = true;
      this.$emit(
        'change',
        { ...this.innerFormData },
        errorSchema &&
          this.errorSchema && {
            ...this.errorSchema,
            [value]: errorSchema
          }
      );
    }
  }
};

function getAvailableKey(preferredKey, formData) {
  var index = 0;
  var newKey = preferredKey;
  // eslint-disable-next-line no-prototype-builtins
  while (formData.hasOwnProperty(newKey)) {
    newKey = `${preferredKey}-${++index}`;
  }
  return newKey;
}

function getDefaultValue(type) {
  switch (type) {
    case 'string':
      return 'New Value';
    case 'array':
      return [];
    case 'boolean':
      return false;
    case 'null':
      return null;
    case 'number':
      return 0;
    case 'object':
      return {};
    default:
      // We don't have a datatype for some reason (perhaps additionalProperties was true)
      return 'New Value';
  }
}
</script>
