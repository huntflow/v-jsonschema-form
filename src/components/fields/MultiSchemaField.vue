<template>
    <div className="panel panel-default panel-body">
        <div className="form-group">
            <component
                :is="widgetWithOptions.widget"
                :id="idSchema.$id + '_anyof_select'"
                :schema="{ type: 'number', default: 0 }"
                :value="selectedOption"
                :options="{ enumOptions }"
                v-bind="widgetWithOptions.options"
                @change="handleOptionChange"
                @focus="onFocus"
                @blur="onBlur"
            />
        </div>

        <component
            :is="registry.fields.SchemaField"
            v-if="showSchemaField"
            :schema="optionSchema"
            :ui-schema="uiSchema"
            :error-schema="errorSchema"
            :id-schema="idSchema"
            :id-prefix="idPrefix"
            :form-data="formData"
            :registry="registry"
            :disabled="disabled"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
        />
    </div>
</template>

<script>
    import {
        getUiOptions,
        getWidget,
        guessType,
        retrieveSchema,
        getDefaultFormState,
        getMatchingOption,
    } from '../../utils';

    const PROPS = {
        baseType: String,
        disabled: { type: Boolean, default: false, },
        errorSchema: Object,
        schema: Object,
        formData: Object,
        idPrefix: String,
        idSchema: Object,
        options: Array,
        registry: Object,
        uiSchema: Object,
        onChange: Function,
        onFocus: Function,
        onBlur: Function,
    };

    export default {
        props: PROPS,
        data() {
            return {
                selectedOption: this.getMatchingOption(this.formData, this.options),
            };
        },
        computed: {
            enumOptions() {
                return this.options.map((option, index) => ({
                    label: option.title || `Option ${index + 1}`,
                    value: index,
                }));
            },
            widgetWithOptions() {
                const { widgets, } = this.registry;
                const { widget = 'select', ...uiOptions } = getUiOptions(this.uiSchema);
                return {
                    widget: getWidget({ type: 'number', }, widget, widgets),
                    options: uiOptions,
                };
            },

            showSchemaField() {
                return Boolean(this.options[this.selectedOption]);
            },

            optionSchema() {
                const option = this.options[this.selectedOption] || null;
                if (option) {
                    // If the subschema doesn't declare a type, infer the type from the
                    // parent schema
                    return option.type
                        ? option
                        : Object.assign({}, option, { type: this.baseType, });
                }
                return undefined;
            },

        },
        watch: {
            $props: {
                handler(newProps) {
                    const matchingOption = this.getMatchingOption(
                        newProps.formData,
                        newProps.options
                    );
                    if (matchingOption !== this.selectedOption) {
                        this.selectedOption = matchingOption;
                    }
                },
                deep: true,
            },
        },
        methods: {
            getMatchingOption(formData, options) {
                let option = getMatchingOption(formData, options);
                if (option !== 0) {
                    return option;
                }
                // If the form data matches none of the options, use the currently selected
                // option, assuming it's available; otherwise use the first option
                return this.selectedOption;
            },
            handleOptionChange(option) {
                const selectedOption = parseInt(option, 10);
                const { formData, onChange, options } = this.$props;
                const newOption = retrieveSchema(
                    options[selectedOption],
                    formData
                );

                // If the new option is of type object and the current data is an object,
                // discard properties added using the old option.
                let newFormData = undefined;
                if (
                    guessType(formData) === 'object' &&
                    (newOption.type === 'object' || newOption.properties)
                ) {
                    newFormData = Object.assign({}, formData);

                    const optionsToDiscard = options.slice();
                    optionsToDiscard.splice(selectedOption, 1);

                    // Discard any data added using other options
                    for (const option of optionsToDiscard) {
                        if (option.properties) {
                            for (const key in option.properties) {
                                // eslint-disable-next-line no-prototype-builtins
                                if (newFormData.hasOwnProperty(key)) {
                                    delete newFormData[key];
                                }
                            }
                        }
                    }
                }
                // Call getDefaultFormState to make sure defaults are populated on change.
                onChange(
                    'change',
                    getDefaultFormState(options[selectedOption], newFormData)
                );

                this.selectedOption = parseInt(option, 10);
            },
        },
    };

</script>
