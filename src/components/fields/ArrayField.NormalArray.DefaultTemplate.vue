<template>
  <fieldset :id="id">
    <slot name="default" />
  </fieldset>
</template>

<script>
export default {
  name: 'ArrayFieldNormalArrayDefaultTemplate',
  props: {
    id: String
  }
};
</script>
