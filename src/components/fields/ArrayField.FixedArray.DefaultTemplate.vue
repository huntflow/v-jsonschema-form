<template>
  <fieldset>
    <slot name="default" />
  </fieldset>
</template>

<script>
export default {
  name: 'ArrayFieldFixedArrayDefaultTemplate',
  compatConfig: {
    MODE: 3
  }
};
</script>
