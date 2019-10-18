<template>
    <input
        :type="type"
        :autofocus="autofocus"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :value="value"
        @change="handleChange"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
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
    };

    export default {
        props: PROPS,
        inheritAttrs: false,
        methods: {
            handleChange(event) {
                const value = event.target.value;
                const inputValue = value === ''
                   ? (this.options && this.options.emptyValue)
                   : value;

                this.$emit('change', inputValue);
            },
        },
    };
</script>
