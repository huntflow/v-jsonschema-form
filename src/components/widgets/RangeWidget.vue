<template>
    <div className="field-range-wrapper">
        <base-input
            type="range"
            v-bind="componentProps"
            @blur="$emit('blur', $event)"
            @change="$emit('change', $event)"
            @focus="$emit('focus', $event)"
        />
        <span className="range-view">{{ value }}</span>
    </div>
</template>

<script>
    import { rangeSpec, } from '../../utils';
    import BaseInput from './BaseInput';

    const PROPS = {
        autofocus: {},
        disabled: { type: Boolean, default: false, },
        readonly: { type: Boolean, default: false, },
        required: { type: Boolean, default: false, },
        value: [String, Number,],
        options: Object,
        schema: Object,
    };

    export default {
        components: {
            'base-input': BaseInput,
        },
        props: PROPS,
        computed: {
            componentProps() {
                return {
                    ...this.$props,
                    ...(rangeSpec(this.schema) || {}),
                };
            },
        },
    };
</script>
