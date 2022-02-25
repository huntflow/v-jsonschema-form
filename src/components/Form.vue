<template>
  <base-form ref="vjsf" v-bind="$props" :schema="enrichedSchema" v-on="$listeners" />
</template>

<script>
import { getEnrichedSchema } from '@/helpers/schema';
import BaseForm from './_Form';
import { PROPS } from './form-props';

export default {
  name: 'VjsfFormWrapper',
  components: {
    BaseForm
  },
  props: PROPS,
  data() {
    return {
      dereferencedSchema: null,
      isDereference: false
    };
  },
  computed: {
    enrichedSchema() {
      return getEnrichedSchema(this.schema);
    }
  },
  methods: {
    submit() {
      this.$refs.vjsf.submit();
    }
  }
};
</script>
