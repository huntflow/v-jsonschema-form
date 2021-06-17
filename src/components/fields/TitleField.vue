<template>
  <legend :id="id">
    {{ title }}
  </legend>
</template>

<script>
const PROPS = {
  id: String,
  title: String
};

export default {
  name: 'TitleField',
  props: PROPS
};
</script>
