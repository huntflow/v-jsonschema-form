<template>
  <p v-if="description" :id="id" class="field-description">
    {{ description }}
  </p>
</template>

<script>
export default {
  name: 'DescriptionField',
  props: {
    id: String,
    description: String
  }
};
</script>
