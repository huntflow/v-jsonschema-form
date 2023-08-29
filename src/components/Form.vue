<template>
  <base-form ref="vjsf" v-bind="$props" :schema="enrichedSchema" v-on="$listeners">
    <template #before-content="scopedProps">
      <slot name="before-content" v-bind="scopedProps" />
    </template>

    <template #after-content="scopedProps">
      <slot name="after-content" v-bind="scopedProps" />
    </template>
  </base-form>
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
    }
  },
  methods: {
    submit() {
      this.$refs.vjsf.submit();
    }
  }
};
</script>
