<template>
    <fixed-array
        v-if="isFixedArray"
        :keyed-form-data="keyedFormData"
        :schema="schema"
        :ui-schema="uiSchema"
        :form-data="formData"
        :error-schema="errorSchema"
        :id-prefix="idPrefix"
        :id-schema="idSchema"
        :name="name"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :autofocus="autofocus"
        :registry="registry"
        :raw-errors="rawErrors"
        :on-blur="onBlur"
        :on-focus="onFocus"
        :on-change-for-index="handleChangeForIndex"
        :on-add-click="handleAddClick"
        :on-reorder-click="handleReorderClick"
        :on-drop-index-click="handleDropIndexClick"
    />

    <multiselect-array
        v-else-if="isMultiSelectArray"
        :schema="schema"
        :ui-schema="uiSchema"
        :form-data="formData"
        :id-schema="idSchema"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :autofocus="autofocus"
        :registry="registry"
        :raw-errors="rawErrors"
        :on-blur="onBlur"
        :on-focus="onFocus"
        :on-change="onChange"
        :on-reorder-click="handleReorderClick"
    />

    <normal-array
        v-else
        :keyed-form-data="keyedFormData"
        :schema="schema"
        :ui-schema="uiSchema"
        :form-data="formData"
        :error-schema="errorSchema"
        :id-prefix="idPrefix"
        :id-schema="idSchema"
        :name="name"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :autofocus="autofocus"
        :registry="registry"
        :raw-errors="rawErrors"
        :on-blur="onBlur"
        :on-focus="onFocus"
        :on-change-for-index="handleChangeForIndex"
        :on-add-click="handleAddClick"
        :on-reorder-click="handleReorderClick"
        :on-drop-index-click="handleDropIndexClick"
    />
</template>

<script>
    import shortid from 'shortid';
    import NormalArray from './ArrayField.NormalArray';
    import FixedArray from './ArrayField.FixedArray';
    import MultiSelect from './ArrayField.MultiSelect';
    import {
        getDefaultFormState,
        isMultiSelect,
        isFixedItems,
        allowAdditionalItems,
        getDefaultRegistry,
    } from '../../utils';

    const PROPS = {
        name: String,
        idPrefix: String,
        rawErrors: Array,
        uiSchema: { type: Object, default: () => ({}), },
        formData: { type: Array, default: () => [], },
        idSchema: { type: Object, default: () => ({}), },
        schema: Object,
        errorSchema: Object,
        registry: { type: Object, default: () => getDefaultRegistry(), },
        required: { type: Boolean, default: false, },
        disabled: { type: Boolean, default: false, },
        readonly: { type: Boolean, default: false, },
        autofocus: { type: Boolean, default: false, },
        onBlur: Function,
        onChange: Function,
        onFocus: Function,
    };

    export default {
        components: {
            'normal-array': NormalArray,
            'fixed-array': FixedArray,
            'multiselect-array': MultiSelect,
        },
        inheritAttrs: false,
        props: PROPS,
        data() {
            return {
                keyedFormData: [],
                updatedKeyedFormData: false,
            };
        },
        computed: {
            isFixedArray() {
                return isFixedItems(this.schema);
            },
            isMultiSelectArray() {
                return isMultiSelect(
                    this.schema,
                    this.registry.definitions
                );
            },
        },
        watch: {
            $props: {
                handler(newProps) {
                    if (this.updatedKeyedFormData) {
                        this.updatedKeyedFormData = false;
                        return;
                    }

                    const nextFormData = newProps.formData;
                    const previousKeyedFormData = this.keyedFormData;
                    const newKeyedFormData =
                        nextFormData.length === previousKeyedFormData.length
                            ? previousKeyedFormData.map((previousKeyedFormDatum, index) => {
                                return {
                                    key: previousKeyedFormDatum.key,
                                    item: nextFormData[index],
                                };
                            })
                            : generateKeyedFormData(nextFormData);

                    this.keyedFormData = newKeyedFormData;
                },
                deep: true, // TODO: check if it's really needed
                immediate: true,
            },
        },
        methods: {
            getNewFormDataRow() {
                let itemSchema = this.schema.items;
                if (isFixedItems(this.schema) && allowAdditionalItems(this.schema)) {
                    itemSchema = this.schema.additionalItems;
                }
                return getDefaultFormState(itemSchema, undefined, this.registry.definitions);
            },

            handleAddClick(event) {
                event.preventDefault();
                const newKeyedFormDataRow = {
                    key: generateRowId(),
                    item: this.getNewFormDataRow(),
                };
                const newKeyedFormData = [...this.keyedFormData, newKeyedFormDataRow,];
                this.keyedFormData = newKeyedFormData;
                this.updatedKeyedFormData = true;
                this.onChange(keyedToPlainFormData(newKeyedFormData));
            },

            handleChangeForIndex(index) {
                return (value, errorSchema) => {
                    const newFormData = this.formData.map((item, i) => {
                        // We need to treat undefined items as nulls to have validation.
                        // See https://github.com/tdegrunt/jsonschema/issues/206
                        const jsonValue = typeof value === 'undefined' ? null : value;
                        return index === i ? jsonValue : item;
                    });

                    this.onChange(
                        newFormData,
                        errorSchema &&
                            this.errorSchema && {
                                ...this.errorSchema,
                                [index]: errorSchema,
                            }
                    );
                };
            },

            handleDropIndexClick(index) {
                return event => {
                    if (event) {
                        event.preventDefault();
                    }
                    // refs #195: revalidate to ensure properly reindexing errors
                    let newErrorSchema;
                    if (this.errorSchema) {
                        newErrorSchema = {};
                        const errorSchema = this.errorSchema;
                        for (let i in errorSchema) {
                            i = parseInt(i);
                            if (i < index) {
                                newErrorSchema[i] = errorSchema[i];
                            } else if (i > index) {
                                newErrorSchema[i - 1] = errorSchema[i];
                            }
                        }
                    }
                    const newKeyedFormData = this.keyedFormData.filter((_, i) => i !== index);
                    this.keyedFormData = newKeyedFormData;
                    this.updatedKeyedFormData = true;
                    this.onChange(keyedToPlainFormData(newKeyedFormData), newErrorSchema);
                };
            },

            handleReorderClick(index, newIndex) {
                const reOrderArray = () => {
                    // Copy item
                    let _newKeyedFormData = this.keyedFormData.slice();

                    // Moves item from index to newIndex
                    _newKeyedFormData.splice(index, 1);
                    _newKeyedFormData.splice(newIndex, 0, this.keyedFormData[index]);
                    return _newKeyedFormData;
                };

                return event => {
                    if (event) {
                        event.preventDefault();
                        event.target.blur();
                    }
                    let newErrorSchema;
                    if (this.errorSchema) {
                        newErrorSchema = {};
                        const errorSchema = this.errorSchema;
                        for (let i in errorSchema) {
                            if (i == index) {
                                newErrorSchema[newIndex] = errorSchema[index];
                            } else if (i == newIndex) {
                                newErrorSchema[index] = errorSchema[newIndex];
                            } else {
                                newErrorSchema[i] = errorSchema[i];
                            }
                        }
                    }

                    const newKeyedFormData = reOrderArray();
                    this.keyedFormData = newKeyedFormData;
                    this.onChange(keyedToPlainFormData(newKeyedFormData), newErrorSchema);
                };
            },
        },
    };


    function generateRowId() {
        return shortid.generate();
    }

    function generateKeyedFormData(formData) {
        return !Array.isArray(formData)
            ? []
            : formData.map(item => {
                return {
                    key: generateRowId(),
                    item,
                };
            });
    }

    function keyedToPlainFormData(keyedFormData) {
        return keyedFormData.map(keyedItem => keyedItem.item);
    }
</script>
