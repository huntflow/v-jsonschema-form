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
            :on-blur="handleBlur"
            :on-change="handleChange"
            :on-focus="handleFocus"
        />
    </form>
</template>

<script>
import _pick from 'lodash.pick';
import _get from 'lodash.get';
import _isEmpty from 'lodash.isempty';
import { default as DefaultErrorList, } from './ErrorList';
import validateFormData, { toErrorList, } from '../validate';
import {
    getDefaultFormState,
    retrieveSchema,
    toIdSchema,
    getDefaultRegistry,
    toPathSchema,
    isObject,
} from '../utils';
import { removeEmptySchemaFields } from '../remove-empty-schema-fields';

const PROPS = {
    id: String,
    idPrefix: String,
    name: String,
    method: String,
    target: String,
    action: String,
    autocomplete: String, // "on" / "off"
    enctype: String,
    acceptcharset: String,
    formData: [String, Number, Boolean, Array, Object,],
    schema: { type: Object, default: () => ({}), },
    showErrorList: { type: Boolean, default: true, },
    uiSchema: { type: Object, default: () => ({}), },
    noValidate: { type: Boolean, default: false, },
    liveValidate: { type: Boolean, default: false, },
    disabled: { type: Boolean, default: false, },
    noHtml5Validate: { type: Boolean, default: false, },
    ErrorList: { type: Object, default: () => DefaultErrorList, },
    omitExtraData: { type: Boolean, default: false, },
    fields: { type: Object, default: () => ({}) },
    widgets: { type: Object, default: () => ({}) },
    arrayFieldTemplate: { type: Object, default: undefined },
    objectFieldTemplate: { type: Object, default: undefined },
    fieldTemplate: { type: Object, default: undefined },
    omitMissingFields: { type: Boolean, default: false }
};

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
        };
    },
    computed: {
        shouldShowErrorList() {
            return (
                this.showErrorList !== false &&
                this.errorsState &&
                this.errorsState.length > 0
            );
        },
    },
    watch: {
        formData: {
            handler(formData) {
                const schema = this.omitMissingFields
                    ? removeEmptySchemaFields(this.schema, formData)
                    : this.schema;

                const newState = this.getStateFromProps({
                    schema,
                    uiSchema: this.uiSchema,
                    liveValidate: this.liveValidate,
                    noValidate: this.noValidate,
                    customFormats: this.customFormats,
                    additionalMetaSchemas: this.additionalMetaSchemas,
                    idPrefix: this.idPrefix,
                }, formData);

                this.schemaState = newState.schema;
                this.uiSchemaState = newState.uiSchema;
                this.idSchemaState = newState.idSchema;
                this.formDataState = newState.formData;
                this.editState = newState.edit;
                this.errorsState = newState.errors;
                this.errorSchemaState = newState.errorSchema;
                this.additionalMetaSchemasState = newState.additionalMetaSchemas;
            },
            immediate: true,
        },
        formDataState: {
            handler(state) {
                this.$emit('change', state);
            }
        }
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
                const retrievedSchema = retrieveSchema(
                    this.schemaState,
                    newFormData
                );
                const pathSchema = toPathSchema(
                    retrievedSchema,
                    '',
                    newFormData
                );

                const fieldNames = getFieldNames(pathSchema, newFormData);
                newFormData = getUsedFormData(newFormData, fieldNames);
            }

            if (!this.noValidate) {
                const { errors, errorSchema, } = this.doValidate(newFormData);
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
                status: 'submitted',
            };

            this.$emit('submit', submitPayload, event);
            if (this.onSubmit) {
                this.onSubmit(submitPayload, event);
            }
        },
        handleFocus() {
            // noop
            // TODO
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
                const retrievedSchema = retrieveSchema(
                    this.schemaState,
                    formData
                );
                const pathSchema = toPathSchema(
                    retrievedSchema,
                    '',
                    formData
                );

                const fieldNames = getFieldNames(pathSchema, formData);
                newFormData = getUsedFormData(formData, fieldNames);
                this.formDataState = newFormData;
            }

            if (mustValidate) {
                const { errors, errorSchema, } = this.doValidate(newFormData);
                this.errorsState = errors;
                this.errorSchemaState = errorSchema;
            } else if (!this.noValidate && newErrorSchema) {
                this.errorsState = newErrorSchema;
                this.errorSchemaState = toErrorList(newErrorSchema);
            }
        },
        handleBlur() {
            // noop
            // TODO
        },
        getRegistry() {
            // For BC, accept passed SchemaField and TitleField props and pass them to
            // the "fields" registry one.
            const { fields, widgets, } = getDefaultRegistry();
            return {
                fields: { ...fields, ...this.$props.fields, },
                widgets: { ...widgets, ...this.$props.widgets, },
                ArrayFieldTemplate: this.$props.ArrayFieldTemplate,
                ObjectFieldTemplate: this.$props.ObjectFieldTemplate,
                FieldTemplate: this.$props.FieldTemplate
            };
        },
        getStateFromProps(props, inputFormData) {
            const schema = this.omitMissingFields
                ? removeEmptySchemaFields(props.schema, inputFormData)
                : props.schema;

            const uiSchema = props.uiSchema;
            const edit = typeof inputFormData !== 'undefined';
            const liveValidate = props.liveValidate;
            const mustValidate = edit && !props.noValidate && liveValidate;
            const formData = getDefaultFormState(schema, inputFormData);
            const retrievedSchema = retrieveSchema(schema, formData);
            const customFormats = props.customFormats;
            const additionalMetaSchemas = props.additionalMetaSchemas;
            const { errors, errorSchema, } = mustValidate
                                           ? this.doValidate(formData, schema, additionalMetaSchemas, customFormats)
                                           : {
                                               errors: this.errorsState || [],
                                               errorSchema: this.errorSchemaState || {},
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
                additionalMetaSchemas,
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
        },
    },
};

function getUsedFormData(formData, fields) {
    //for the case of a single input form
    if (fields.length === 0 && typeof formData !== 'object') {
        return formData;
    }
    let data = _pick(formData, fields);
    if (Array.isArray(formData)) {
        return Object.keys(data).map(key => data[key]);
    }
    return data;
}

function getFieldNames(pathSchema, formData) {
    const getAllPaths = (_obj, acc = [], paths = ['',]) => {
        Object.keys(_obj).forEach(key => {
            if (typeof _obj[key] === 'object') {
                let newPaths = paths.map(path => `${path}.${key}`);
                getAllPaths(_obj[key], acc, newPaths);
            } else if (key === '$name' && _obj[key] !== '') {
                paths.forEach(path => {
                    path = path.replace(/^\./, '');
                    const formValue = _get(formData, path);
                    // adds path to fieldNames if it points to a value
                    // or an empty object/array
                    if (typeof formValue !== 'object' || _isEmpty(formValue)) {
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
