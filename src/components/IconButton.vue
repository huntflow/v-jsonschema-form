<template>
  <button
    type="button"
    class="btn"
    :class="'btn-' + type"
    :disabled="disabled"
    v-on="$listeners"
  >
    <i class="glyphicon" :class="'glyphicon-' + icon" />
  </button>
</template>

<script>
const PROPS = {
  icon: String,
  type: String,
  disabled: { type: Boolean, default: false }
};

export default {
  props: PROPS
};
</script>
