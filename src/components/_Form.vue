<template>
  <form
    ref="form"
    :id="id"
    :acceptcharset="acceptcharset"
    :action="action"
    :autocomplete="autocomplete"
    :enctype="enctype"
    :method="method"
    :name="name"
    :novalidate="noHtml5Validate"
    :target="target"
    @submit="handleSubmit"
  >
    <component
      :is="ErrorList"
      v-if="shouldShowErrorList"
      :error-schema="errorSchemaState"
      :errors="errorsState"
      :schema="schemaState"
      :ui-schema="uiSchemaState"
    />
    <component
      :is="getRegistry().fields.SchemaField"
      :disabled="disabled"
      :error-schema="errorSchemaState"
      :form-data="formDataState"
      :id-prefix="idPrefix"
      :id-schema="idSchemaState"
      :registry="getRegistry()"
      :schema="schemaState"
      :ui-schema="uiSchemaState"
      v-on="schemaFieldEventListeners"
      @change="handleChange"
    />
  </form>
</template>

<script>
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import validateFormData, { toErrorList } from '../validate';
import {
  getDefaultFormState,
  retrieveSchema,
  toIdSchema,
  getDefaultRegistry,
  toPathSchema,
  isObject
} from '../utils';
import { removeEmptySchemaFields } from '../remove-empty-schema-fields';
import { PROPS } from './form-props';

export default {
  props: PROPS,
  data() {
    return {
      schemaState: {},
      uiSchemaState: {},
      idSchemaState: {},
      formDataState: {},
      editState: false,
      errorsState: [],
      errorSchemaState: {},
      additionalMetaSchemasState: undefined,
      initialized: false,
    };
  },
  computed: {
    shouldShowErrorList() {
      return this.showErrorList !== false && this.errorsState && this.errorsState.length > 0;
    },
    schemaFieldEventListeners() {
      return pick(this.$listeners, ['focus', 'blur']);
    }
  },
  watch: {
    formData: {
      handler(formData) {
        const schema = this.omitMissingFields
          ? removeEmptySchemaFields(this.schema, formData)
          : this.schema;

        const newState = this.getStateFromProps(
          {
            schema,
            uiSchema: this.uiSchema,
            liveValidate: this.liveValidate,
            noValidate: this.noValidate,
            customFormats: this.customFormats,
            additionalMetaSchemas: this.additionalMetaSchemas,
            idPrefix: this.idPrefix
          },
          formData
        );

        this.schemaState = newState.schema;
        this.uiSchemaState = newState.uiSchema;
        this.idSchemaState = newState.idSchema;
        this.formDataState = newState.formData;
        this.editState = newState.edit;
        this.errorsState = newState.errors;
        this.errorSchemaState = newState.errorSchema;
        this.additionalMetaSchemasState = newState.additionalMetaSchemas;
      },
      immediate: true
    },
    formDataState: {
      handler(state) {
        this.$emit('change', state);
      }
    }
  },
  mounted () {
    this.initialized = true;
  },
  methods: {
    submit() {
      this.$refs.form.requestSubmit();
    },
    handleSubmit(event) {
      event.preventDefault();
      if (
        event.target !== event.currentTarget &&
        // при вызове метода requestSubmit в сurrentTarget - null
        event.currentTarget
      ) {
        return;
      }

      let newFormData = this.formDataState;

      if (this.omitExtraData === true) {
        const retrievedSchema = retrieveSchema(this.schemaState, newFormData);
        const pathSchema = toPathSchema(retrievedSchema, '', newFormData);

        const fieldNames = getFieldNames(pathSchema, newFormData);
        newFormData = getUsedFormData(newFormData, fieldNames);
      }

      if (!this.noValidate) {
        const { errors, errorSchema } = this.doValidate(newFormData);
        if (Object.keys(errors).length > 0) {
          this.errorsState = errors;
          this.errorSchemaState = errorSchema;

          // TODO: see React setState callback
          if (this.onError) {
            this.onError(errors);
          } else {
            console.error('Form validation failed', errors);
          }
          return;
        }
      }

      this.formDataState = newFormData;
      this.errorsState = [];
      this.errorSchemaState = {};

      const submitPayload = {
        schema: this.schemaState,
        uiSchema: this.uiSchemaState,
        idSchema: this.idSchemaState,
        formData: this.formDataState,
        edit: this.editState,
        errors: this.errorsState,
        errorSchema: this.errorSchemaState,
        additionalMetaSchemas: this.additionalMetaSchemasState,
        status: 'submitted'
      };

      this.$emit('submit', submitPayload, event);
      if (this.onSubmit) {
        this.onSubmit(submitPayload, event);
      }
    },
    handleChange(formData, newErrorSchema) {
      if (isObject(formData) || Array.isArray(formData)) {
        const newState = this.getStateFromProps(this.$props, formData);
        formData = newState.formData;
      }
      this.formDataState = formData;

      const mustValidate = !this.noValidate && this.liveValidate;
      let newFormData = formData;

      if (this.omitExtraData === true && this.liveOmit === true) {
        const retrievedSchema = retrieveSchema(this.schemaState, formData);
        const pathSchema = toPathSchema(retrievedSchema, '', formData);

        const fieldNames = getFieldNames(pathSchema, formData);
        newFormData = getUsedFormData(formData, fieldNames);
        this.formDataState = newFormData;
      }

      if (mustValidate) {
        const { errors, errorSchema } = this.doValidate(newFormData);
        this.errorsState = errors;
        this.errorSchemaState = errorSchema;
      } else if (!this.noValidate && newErrorSchema) {
        this.errorsState = newErrorSchema;
        this.errorSchemaState = toErrorList(newErrorSchema);
      }
    },
    getRegistry() {
      // For BC, accept passed SchemaField and TitleField props and pass them to
      // the "fields" registry one.
      const { fields, widgets } = getDefaultRegistry();
      return {
        fields: { ...fields, ...this.fields },
        widgets: { ...widgets, ...this.widgets }
      };
    },
    getStateFromProps(props, inputFormData) {
      const schema = this.omitMissingFields
        ? removeEmptySchemaFields(this.schema, inputFormData)
        : this.schema;

      const uiSchema = props.uiSchema;
      const edit = typeof inputFormData !== 'undefined';
      const liveValidate = props.liveValidate;
      const mustValidate =
        edit && !props.noValidate && liveValidate && (this.validateOnInit || this.initialized);
      const formData = getDefaultFormState(schema, inputFormData);
      const retrievedSchema = retrieveSchema(schema, formData);
      const customFormats = props.customFormats;
      const additionalMetaSchemas = props.additionalMetaSchemas;
      const { errors, errorSchema } = mustValidate
        ? this.doValidate(formData, schema, additionalMetaSchemas, customFormats)
        : {
            errors: this.errorsState || [],
            errorSchema: this.errorSchemaState || {}
          };
      const idSchema = toIdSchema(
        retrievedSchema,
        uiSchema['ui:rootFieldId'],
        formData,
        props.idPrefix
      );
      return {
        schema,
        uiSchema,
        idSchema,
        formData,
        edit,
        errors,
        errorSchema,
        additionalMetaSchemas
      };
    },
    doValidate(
      formData,
      schema = this.schemaState,
      additionalMetaSchemas = this.additionalMetaSchemasState,
      customFormats = this.customFormatsState
    ) {
      const resolvedSchema = retrieveSchema(schema, formData);
      return validateFormData(
        formData,
        resolvedSchema,
        this.validate,
        this.transformErrors,
        additionalMetaSchemas,
        customFormats
      );
    }
  }
};

function getUsedFormData(formData, fields) {
  //for the case of a single input form
  if (fields.length === 0 && typeof formData !== 'object') {
    return formData;
  }
  let data = pick(formData, fields);
  if (Array.isArray(formData)) {
    return Object.keys(data).map((key) => data[key]);
  }
  return data;
}

function getFieldNames(pathSchema, formData) {
  const getAllPaths = (_obj, acc = [], paths = ['']) => {
    Object.keys(_obj).forEach((key) => {
      if (typeof _obj[key] === 'object') {
        let newPaths = paths.map((path) => `${path}.${key}`);
        getAllPaths(_obj[key], acc, newPaths);
      } else if (key === '$name' && _obj[key] !== '') {
        paths.forEach((path) => {
          path = path.replace(/^\./, '');
          const formValue = get(formData, path);
          // adds path to fieldNames if it points to a value
          // or an empty object/array
          if (typeof formValue !== 'object' || isEmpty(formValue)) {
            acc.push(path);
          }
        });
      }
    });
    return acc;
  };

  return getAllPaths(pathSchema);
}
</script>
