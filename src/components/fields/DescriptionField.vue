<template>
  <p v-if="description" :id="id" class="field-description">
    {{ description }}
  </p>
</template>

<script>
const PROPS = {
  id: String,
  description: String
};

export default {
  props: PROPS
};
</script>
