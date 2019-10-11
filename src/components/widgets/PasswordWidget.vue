<template>
    <base-input
        type="password"
        class="form-control"
        :autofocus="autofocus"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :value="value"
        :on-blur="onBlur"
        :on-change="onChange"
        :on-focus="onFocus"
    />
</template>

<script>
    import BaseInput from './BaseInput';

    const PROPS = {
        autofocus: {},
        disabled: { type: Boolean, default: false, },
        readonly: { type: Boolean, default: false, },
        required: { type: Boolean, default: false, },
        value: String,
        onBlur: Function,
        onChange: Function,
        onFocus: Function,
        options: Object,
    };

    export default {
        components: {
            'base-input': BaseInput,
        },
        inheritAttrs: false,
        props: PROPS,
    };
</script>
