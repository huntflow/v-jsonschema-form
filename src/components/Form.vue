<template>
  <base-form
    ref="vjsf"
    v-bind="$props"
    :schema="enrichedSchema"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @change="$emit('change', $event)"
    @submit="handleSubmit"
  >
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
  compatConfig: {
    MODE: 3
  },
  components: {
    BaseForm
  },
  props: PROPS,
  emits: ['focus', 'blur', 'change', 'submit'],
  computed: {
    enrichedSchema() {
      return getEnrichedSchema(this.schema);
    }
  },
  methods: {
    submit() {
      this.$refs.vjsf.submit();
    },
    handleSubmit(...payload) {
      this.$emit('submit', ...payload);
    }
  }
};
</script>
