<template>
  <base-form ref="vjsf" :key="key" v-bind="$props" :schema="enrichedSchema" v-on="$listeners" />
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
  computed: {
    enrichedSchema() {
      return getEnrichedSchema(this.schema);
    },
    key() {
      return JSON.stringify(this.schema);
    }
  },
  methods: {
    submit() {
      this.$refs.vjsf.submit();
    }
  }
};
</script>
