<template>
  <p v-if="description" :id="id" class="field-description">
    {{ description }}
  </p>
</template>

<script>
export default {
  name: 'DescriptionField',
  compatConfig: {
    MODE: 3
  },
  props: {
    id: String,
    description: String
  }
};
</script>
