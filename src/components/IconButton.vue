<template>
    <button
        type="button"
        class="btn"
        :class="'btn-' + type"
        :disabled="disabled"
        @click="handleClick"
    >
        <i
            class="glyphicon"
            :class="'glyphicon-' + icon"
        />
    </button>
</template>

<script>
    const PROPS = {
        icon: String,
        type: String,
        onClick: Function,
        disabled: { type: Boolean, default: false, },
    };

    export default {
        props: PROPS,
        methods: {
            handleClick(e) {
                this.onClick(e);
            },
        },
    };
</script>
