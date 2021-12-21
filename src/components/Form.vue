<template>
  <base-form
    v-if="isDereference"
    ref="vjsf"
    v-bind="$props"
    :schema="dereferencedSchema"
    v-on="$listeners"
  />
</template>

<script>
import { dereference } from '@/helpers/dereference';
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
  watch: {
    schema: {
      immediate: true,
      handler(schema) {
        this.isDereference = false;
        dereference(schema)
          .then((result) => {
            this.dereferencedSchema = getEnrichedSchema(result);
          })
          .finally(() => {
            this.isDereference = true;
          });
      }
    }
  },
  methods: {
    submit() {
      this.$refs.vjsf.submit();
    }
  }
};
</script>
