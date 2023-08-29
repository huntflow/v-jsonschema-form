<template>
  <div>
    <div>
      <div>LEFT SIDE</div>
      <slot name="position"></slot>
      <slot name="body"></slot>
    </div>
    <div>
      <div>RIGHT SIDE</div>
      <slot name="visibility"></slot>
    </div>

    <slot name="children"></slot>
  </div>
</template>

<script>
export default {
  props: {
    orderedProperties: {
      type: Array,
      required: true
    }
  }
};
</script>
