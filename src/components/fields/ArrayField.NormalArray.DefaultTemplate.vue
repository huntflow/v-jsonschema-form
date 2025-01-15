<template>
  <fieldset :id="id">
    <slot name="default" />
  </fieldset>
</template>

<script>
export default {
  name: 'ArrayFieldNormalArrayDefaultTemplate',
  compatConfig: {
    MODE: 3
  },
  props: {
    id: String
  }
};
</script>
