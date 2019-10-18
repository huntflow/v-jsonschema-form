<template>
    <base-input
        type="number"
        class="form-control"
        :autofocus="autofocus"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :value="value"
        @change="$emit('change', $event)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
    />
</template>

<script>
    import BaseInput from './BaseInput';

    const PROPS = {
        autofocus: {},
        disabled: { type: Boolean, default: false, },
        readonly: { type: Boolean, default: false, },
        required: { type: Boolean, default: false, },
        value: [Number, String,],
        options: Object,
        schema: Object,
    };

    export default {
        components: {
            'base-input': BaseInput,
        },
        inheritAttrs: false,
        props: PROPS,
    };
</script>
