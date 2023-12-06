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
    <slot name="before-content" :errors="errors" :error-schema="errorSchema" />
    <component
      :is="registry.fields.SchemaField"
      :id="idPrefix"
      pointer=""
      :form-data="formDataState"
      :disabled="disabled"
      :errors="errorSchema"
      :registry="registry"
      :schema="resolvedSchema"
      :ui-schema="uiSchema"
      v-on="schemaFieldEventListeners"
      @change="handleChange"
    />
    <slot name="after-content" :errors="errors" :error-schema="errorSchema" />
  </form>
</template>

<script>
import pick from 'lodash/pick';
import cloneDeep from 'lodash/cloneDeep';
import jsonPointer from 'json-pointer';

import { compileSchema } from '@/validate';
import { getDefaultRegistry } from '@/utils';
import { PROPS } from './form-props';
import { VALIDATION_MODE } from '@/constants';
import { getDefaults, resolveSchemaShallowly, removeEmptySchemaFields } from '@/helpers/schema';

export default {
  name: 'VjsfForm',
  props: PROPS,
  provide() {
    return {
      resolveSchemaShallowly: this.resolveSchemaShallowly,
      setFormDataByPointer: this.setFormDataByPointer
    };
  },
  data() {
    return {
      formDataState: undefined,
      errors: [],
      errorSchema: {},
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
    },
    registry() {
      // For BC, accept passed SchemaField and TitleField props and pass them to
      // the "fields" registry one.
      const { fields, widgets } = getDefaultRegistry();
      return {
        fields,
        widgets: { ...widgets, ...this.widgets }
      };
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
              errors: this.errors || [],
              errorSchema: this.errorSchema || {}
            };

        this.errors = errors;
        this.errorSchema = errorSchema;
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
          this.errors = errors;
          this.errorSchema = errorSchema;

          this.$emit('error', errors);
          console.error('Form validation failed', errors);
          this.focusFirstFieldBySelector(this.invalidFieldsSelector);
          return;
        }
      }

      this.formDataState = newFormData;
      this.errors = [];
      this.errorSchema = {};

      const submitPayload = {
        schema: this.resolvedSchema,
        uiSchema: this.uiSchema,
        formData: this.formDataState,
        edit: this.isEdit,
        errors: this.errors,
        errorSchema: this.errorSchema,
        status: 'submitted'
      };

      this.$emit('submit', submitPayload, event);
    },
    handleChange(formData) {
      this.formDataState = this.enrichFormData(formData);

      if (this.mustValidate) {
        const { errors, errorSchema } = this.doValidate(this.formDataState);
        this.errors = errors;
        this.errorSchema = errorSchema;
      }
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
    },
    getFormDataByPath(path) {
      if (jsonPointer.has(this.formDataState, path)) {
        return jsonPointer.get(this.formDataState, path);
      }
      return undefined;
    },
    setFormDataByPointer(pointer, value) {
      const paths = jsonPointer.parse(pointer);
      const last = paths.pop();

      const formData = this.getFormDataByPath(jsonPointer.compile(paths));
      if (typeof value === 'function') {
        // Для производительных действий над массивами: удаление/добавление/перемещение
        value(this.getFormDataByPath(pointer));
      } else {
        this.$set(formData, last, value);
      }
      if (this.mustValidate) {
        const { errors, errorSchema } = this.doValidate(this.formDataState);
        this.errors = errors;
        this.errorSchema = errorSchema;
      }
    }
  }
};
</script>
