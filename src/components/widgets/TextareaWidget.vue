<template>
    <textarea
        :id="id"
        class="form-control"
        :autoFocus="autofocus"
        :disabled="disabled"
        :placeholder="placeholder"
        :readOnly="readonly"
        :required="required"
        :rows="options.rows"
        :value="typeof value === 'undefined' ? '' : value"

        @blur="handleBlur"
        @change="handleChange"
        @focus="handleFocus"
    />
</template>


<script>
    const PROPS = {
        id: String,
        options: { default: () => ({}), },
        placeholder: String,
        value: String,
        required: { type: Boolean, default: false, },
        disabled: { type: Boolean, default: false, },
        readonly: { type: Boolean, default: false, },
        autofocus: { default: false, },
        onChange: Function,
        onBlur: Function,
        onFocus: Function,
    };

    export default {
        inheritAttrs: false,
        props: PROPS,
        methods: {
            handleBlur(event) {
                this.onBlur && this.onBlur(this.id, event.target.value);
            },
            handleFocus(event) {
                this.onFocus && this.onFocus(this.id, event.target.value);
            },
            handleChange({ target: { value, }, }) {
                return this.onChange(value === '' ? this.options.emptyValue : value);
            },
        },
    };
</script>
