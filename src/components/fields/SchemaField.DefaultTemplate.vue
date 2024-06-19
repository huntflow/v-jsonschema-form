<template>
  <div v-if="hidden" class="hidden">
    <slot />
  </div>
  <div v-else>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SchemaFieldDefaultTemplate',
  inheritAttrs: false,
  props: {
    id: String,
    label: String,
    schema: Object,
    hidden: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false }
  }
};
</script>
