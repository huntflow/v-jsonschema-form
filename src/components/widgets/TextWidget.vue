<template>
    <base-input
        type="text"
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
        options: Object,
        value: [String, Number,],
        disabled: { type: Boolean, default: false, },
        readonly: { type: Boolean, default: false, },
        required: { type: Boolean, default: false, },
        onBlur: Function,
        onChange: Function,
        onFocus: Function,
    };

    export default {
        components: {
            'base-input': BaseInput,
        },
        props: PROPS,
        inheritAttrs: false,
    };
</script>
