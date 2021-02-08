<template>
  <base-form
    v-if="dereferencedSchema"
    v-bind="$props"
    :schema="dereferencedSchema"
    v-on="$listeners"
  />
</template>

<script>
import BaseForm from './_Form.vue';
import { PROPS } from './form-props';
import { dereference } from '../helpers/dereference.js';
import mergeAllOf from 'json-schema-merge-allof';

export default {
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
      this.dereferencedSchema = mergeAllOf(result);
    });
  }
};
</script>
