<template>
  <form
    :id="id"
    ref="form"
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
      :schema="resolvedSchema"
      :ui-schema="uiSchema"
    />
    <component
      :is="getRegistry().fields.SchemaField"
      :disabled="disabled"
      :error-schema="errorSchemaState"
      :form-data="formDataState"
      :id-prefix="idPrefix"
      :id-schema="idSchema"
      :registry="getRegistry()"
      :schema="resolvedSchema"
      :ui-schema="uiSchema"
      v-on="schemaFieldEventListeners"
      @change="handleChange"
    />
  </form>
</template>

<script>
import pick from 'lodash/pick';
import cloneDeep from 'lodash/cloneDeep';
import { compileSchema, toErrorList } from '@/validate';
import { toIdSchema, getDefaultRegistry } from '@/utils';
import { PROPS } from './form-props';
import { VALIDATION_MODE } from '@/constants';
import { getDefaults, resolveSchemaShallowly, removeEmptySchemaFields } from '@/helpers/schema';

export default {
  name: 'VjsfForm',
  props: PROPS,
  provide() {
    return {
      resolveSchemaShallowly: this.resolveSchemaShallowly
    };
  },
  data() {
    return {
      formDataState: undefined,
      errorsState: [],
      errorSchemaState: {},
      submitted: false
    };
  },
  computed: {
    compiledSchemaData() {
      return compileSchema({
        schema: this.schema,
        customFormats: this.customFormats,
        removeAdditional: this.omitExtraData
      });
    },
    resolvedSchema() {
      return this.resolveSchemaShallowly(this.schema, this.formDataState);
    },
    idSchema() {
      return toIdSchema(this.resolvedSchema, this.uiSchema['ui:rootFieldId'], this.idPrefix);
    },
    shouldShowErrorList() {
      return this.showErrorList !== false && this.errorsState && this.errorsState.length > 0;
    },
    schemaFieldEventListeners() {
      return pick(this.$listeners, ['focus', 'blur']);
    },
    isStartValidateOnSubmit() {
      return this.startValidateMode === VALIDATION_MODE.onSubmit;
    },
    canValidateByMode() {
      return !this.isStartValidateOnSubmit || (this.isStartValidateOnSubmit && this.submitted);
    },
    isEdit() {
      return typeof this.formDataState !== 'undefined';
    },
    mustValidate() {
      return this.canValidateByMode && !this.noValidate && this.liveValidate;
    }
  },
  watch: {
    formData: {
      handler(formData) {
        this.formDataState = this.enrichFormData(formData);

        const mustValidate = typeof formData !== 'undefined' && this.mustValidate;
        const { errors, errorSchema } = mustValidate
          ? this.doValidate(this.formDataState)
          : {
              errors: this.errorsState || [],
              errorSchema: this.errorSchemaState || {}
            };

        this.errorsState = errors;
        this.errorSchemaState = errorSchema;
      },
      immediate: true
    },
    formDataState: {
      handler(state) {
        this.$emit('change', state);
      }
    }
  },
  mounted() {
    this.focusFirstFieldBySelector(this.fieldsSelector);
  },
  methods: {
    submit() {
      this.$refs.form.dispatchEvent(new Event('submit', { cancelable: true }));
    },
    focusFirstFieldBySelector(selector) {
      this.$nextTick(() => {
        const firstField = this.$el.querySelector(selector);
        if (firstField) {
          firstField.focus();
        }
      });
    },
    handleSubmit(event) {
      event.preventDefault();
      this.submitted = true;
      let newFormData = this.formDataState;

      if (!this.noValidate) {
        const { errors, errorSchema } = this.doValidate(newFormData);
        if (Object.keys(errors).length > 0) {
          this.errorsState = errors;
          this.errorSchemaState = errorSchema;

          this.$emit('error', errors);
          console.error('Form validation failed', errors);
          this.focusFirstFieldBySelector(this.invalidFieldsSelector);
          return;
        }
      }

      this.formDataState = newFormData;
      this.errorsState = [];
      this.errorSchemaState = {};

      const submitPayload = {
        schema: this.resolvedSchema,
        uiSchema: this.uiSchema,
        idSchema: this.idSchema,
        formData: this.formDataState,
        edit: this.isEdit,
        errors: this.errorsState,
        errorSchema: this.errorSchemaState,
        status: 'submitted'
      };

      this.$emit('submit', submitPayload, event);
    },
    handleChange(formData, newErrorSchema) {
      this.formDataState = this.enrichFormData(formData);

      if (this.mustValidate) {
        const { errors, errorSchema } = this.doValidate(this.formDataState);
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
    enrichFormData(formData) {
      // непонятно нужно ли нам учитывать дефолтные значения с флагом omitMissingFields (режим просмотра)
      return this.omitMissingFields ? formData : getDefaults(this.compiledSchemaData, formData);
    },
    resolveSchemaShallowly(schema, data) {
      const { getSchema } = this.compiledSchemaData;
      const resolvedSchema = resolveSchemaShallowly(schema, {
        getSchema,
        data: cloneDeep(data)
      });
      if (this.omitMissingFields) {
        return removeEmptySchemaFields(resolvedSchema, { data });
      }
      return resolvedSchema;
    },
    doValidate(formData) {
      const { validate, getErrorData } = this.compiledSchemaData;
      validate(cloneDeep(formData));
      return getErrorData();
    }
  }
};
</script>
