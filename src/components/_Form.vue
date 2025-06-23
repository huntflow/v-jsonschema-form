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
    <slot name="before-content" :error-schema="errorSchemaInternal" />
    <component
      :is="registry.fields.SchemaField"
      :id="idPrefix"
      pointer=""
      :form-data="formDataState"
      :disabled="disabled"
      :error-schema="errorSchemaInternal"
      :registry="registry"
      :schema="resolvedSchema"
      :ui-schema="uiSchema"
    />
    <slot name="after-content" :error-schema="errorSchemaInternal" />
  </form>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import jsonPointer from 'json-pointer';

import { compileSchema } from '@/validate';
import { getDefaultRegistry } from '@/utils';
import { PROPS } from './form-props';
import { VALIDATION_MODE } from '@/constants';
import { getDefaults, resolveSchemaShallowly, removeEmptySchemaFields } from '@/helpers/schema';

export default {
  name: 'VjsfForm',
  compatConfig: {
    MODE: 3
  },
  provide() {
    return {
      resolveSchemaShallowly: this.resolveSchemaShallowly,
      setFormDataByPointer: this.setFormDataByPointer
    };
  },
  props: PROPS,
  emits: ['change', 'submit'],
  data() {
    return {
      formDataState: undefined,
      errorSchemaInternal: this.errorSchema || {},
      submitted: false
    };
  },
  computed: {
    compiledSchemaData() {
      return compileSchema({
        schema: this.schema,
        customFormats: this.customFormats,
        removeAdditional: this.omitExtraData,
        useDefaults: this.useDefaults
      });
    },
    resolvedSchema() {
      return this.resolveSchemaShallowly(this.schema, this.formDataState);
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
      const { fields } = getDefaultRegistry();
      return {
        fields,
        widgets: this.widgets
      };
    }
  },
  watch: {
    errorSchema(value) {
      // ошибки от бэка считаем приоритетными,
      // и в случае чего отображаем их
      this.errorSchemaInternal = value || {};
    },
    formData: {
      handler(formData) {
        this.formDataState = this.enrichFormData(formData);

        const mustValidate = typeof formData !== 'undefined' && this.mustValidate;
        const { errorSchema } = mustValidate
          ? this.doValidate(this.formDataState)
          : { errorSchema: this.errorSchemaInternal || {} };

        this.errorSchemaInternal = errorSchema;
      },
      immediate: true
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
        const firstField = this.$refs.form.querySelector(selector);
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
          this.errorSchemaInternal = errorSchema;

          this.$emit('error', errors);
          console.warn('Form validation failed', errors);
          this.focusFirstFieldBySelector(this.invalidFieldsSelector);
          return;
        }
      }

      this.formDataState = newFormData;
      this.errorSchemaInternal = {};

      const submitPayload = {
        // TODO: есть подозрение, что не все свойства используются
        // напр. errors, errorSchema тут и пустые (и таковыми были)
        schema: this.resolvedSchema,
        uiSchema: this.uiSchema,
        formData: this.formDataState,
        edit: this.isEdit,
        errors: [],
        errorSchema: {},
        status: 'submitted'
      };

      this.$emit('submit', submitPayload, event);
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
    setFormDataByPointer(pointer, value, options) {
      const paths = jsonPointer.parse(pointer);
      const last = paths.pop();

      const formData = this.getFormDataByPath(jsonPointer.compile(paths));
      const isPrimitive =
        options?.schema.type === 'string' ||
        options?.schema.type === 'number' ||
        options?.schema.type === 'integer';
      const shouldRemove = isPrimitive && options.required === false && !value && value !== 0;
      if (typeof value === 'function') {
        // Для производительных действий над массивами: удаление/добавление/перемещение
        value(this.getFormDataByPath(pointer));
      } else {
        if (shouldRemove) {
          delete formData[last];
        } else {
          formData[last] = value;
        }
      }
      this.$emit('change', this.formDataState);
      if (this.mustValidate) {
        const { errorSchema } = this.doValidate(this.formDataState);
        this.errorSchemaInternal = errorSchema;
      }
    }
  }
};
</script>
