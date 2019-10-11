<template>
    <input
        :type="type"
        :autofocus="autofocus"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :value="value"

        @blur="handleBlur"
        @change="handleChange"
        @focus="handleFocus"
    >
</template>

<script>
    const PROPS = {
        type: String,
        options: Object,
        value: [String, Number,],
        autofocus: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false, },
        readonly: { type: Boolean, default: false, },
        required: { type: Boolean, default: false, },
        onBlur: Function,
        onChange: Function,
        onFocus: Function,
    };

    export default {
        props: PROPS,
        inheritAttrs: false,
        methods: {
            handleFocus(event) {
                this.onFocus(event);
            },
            handleChange(event) {
                const value = event.target.value;
                this.onChange(
                    value === ''
                        ? (this.options && this.options.emptyValue)
                        : value
                );
            },
            handleBlur(event) {
                this.onBlur(event);
            },
        },
    };
</script>
