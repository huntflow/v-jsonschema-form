<template>
    <component
        :is="widgetWithOptions.widget"
        :id="idSchema && idSchema.$id"
        :options="widgetWithOptions.options"
        :schema="schema"
        :label="schema.title === undefined ? name : schema.title"
        :value="formData"
        :required="required"
        :disabled="disabled"
        :readonly="readonly"
        :autofocus="autofocus"
        :registry="registry"
        :raw-errors="rawErrors"
        :raw-error-infos="rawErrorInfos"
        @change="onChange"
        @focus="onFocus"
        @blur="onBlur"
    />
</template>

<script>
    import {
        getWidget,
        getUiOptions,
        optionsList,
        getDefaultRegistry,
    } from '../../utils';

    const PROPS = {
        name: String,
        schema: Object,
        uiSchema: Object,
        idSchema: Object,
        formData: Boolean,
        rawErrors: Array,
        rawErrorInfos: Array,
        registry: { type: Object, default: () => getDefaultRegistry(), },
        required: { type: Boolean, default: false, },
        disabled: { type: Boolean, default: false, },
        readonly: { type: Boolean, default: false, },
        autofocus: { type: Boolean, default: false, },
        onChange: Function,
        onFocus: Function,
        onBlur: Function,
    };

    export default {
        props: PROPS,
        computed: {
            enumOptions() {
                if (Array.isArray(this.schema.oneOf)) {
                    return optionsList({
                        oneOf: this.schema.oneOf.map(option => ({
                            ...option,
                            title: option.title || (option.const === true ? 'yes' : 'no'),
                        })),
                    });
                }

                return optionsList({
                    enum: this.schema.enum || [true, false,],
                    enumNames: this.schema.enumNames ||
                        (this.schema.enum && this.schema.enum[0] === false
                            ? ['no', 'yes',]
                            : ['yes', 'no',]),
                });
            },
            widgetWithOptions() {
                const { widgets, } = this.registry;
                // eslint-disable-next-line no-unused-vars
                const { widget = 'checkbox', placeholder, ...options } = getUiOptions(
                    this.uiSchema
                );
                return {
                    widget: getWidget(this.schema, widget, widgets),
                    options: { ...options, enumOptions: this.enumOptions, },
                };
            },
        },
    };
</script>
