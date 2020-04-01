<template>
    <div
        v-if="hidden"
        class="hidden"
    >
        <slot />
    </div>
    <div v-else-if="isAdditional === false">
        <template v-if="displayLabel">
            <slot
                v-if="label"
                name="label"
            >
                <label
                    class="form-group__label scheme-form__label"
                    :for="id"
                >
                    {{ label }}
                </label>
            </slot>
        </template>
        <slot
            v-if="displayLabel"
            name="description"
        />
        <slot />
        <slot name="errors" />
        <slot name="help" />
    </div>
    <div v-else>
        "Additional properties" feature is not supported yet.
    </div>
</template>

<script>
    import { ADDITIONAL_PROPERTY_FLAG, } from '../../utils';

    const PROPS = {
        id: String,
        label: String,
        schema: Object,
        hidden: { type: Boolean, default: false },
        required: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        displayLabel: { type: Boolean, default: false },
        readonly: { type: Boolean, default: false },
        onKeyChange: Function,
        onDropPropertyClick: Function,
    };

    export default {
        inheritAttrs: false,
        props: PROPS,
        computed: {
            isAdditional() {
                return Boolean(
                    // eslint-disable-next-line no-prototype-builtins
                    this.schema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG)
                );
            },
        },
    };
</script>
