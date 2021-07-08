<template>
  <base-form
    v-if="dereferencedSchema"
    ref="vjsf"
    v-bind="$props"
    :schema="dereferencedSchema"
    v-on="$listeners"
  />
</template>

<script>
import BaseForm from './_Form.vue';
import { PROPS } from './form-props';
import { dereference } from '../helpers/dereference.js';

export default {
  name: 'VjsfFormWrapper',
  components: {
    BaseForm
  },
  props: PROPS,
  data() {
    return {
      dereferencedSchema: null
    };
  },
  mounted() {
    dereference(this.schema).then((result) => {
      this.dereferencedSchema = result;
    });
  },
  methods: {
    submit() {
      this.$refs.vjsf.submit();
    }
  }
};
</script>
