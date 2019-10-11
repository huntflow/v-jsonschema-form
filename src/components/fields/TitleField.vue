<template>
    <legend :id="id">
        {{ title }}
        <span
            v-if="required"
            class="required"
        >*</span>
    </legend>
</template>

<script>
    const PROPS = {
        id: String,
        title: String,
        required: { type: Boolean, default: false, },
    };

    export default {
        props: PROPS,
    };
</script>
