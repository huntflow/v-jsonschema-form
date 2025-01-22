<template>
  <fieldset :id="id">
    <component
      :is="titleFieldCls"
      v-if="label"
      :id="fieldTitleId"
      :required="required"
      :title="label"
    />
    <component
      :is="descriptionFieldCls"
      v-if="description"
      :id="fieldDescriptionId"
      :description="description"
    />
    <slot v-for="name in orderedProperties" :name="name" />
  </fieldset>
</template>

<script>
export default {
  name: 'ObjectFieldDefaultTemplate',
  compatConfig: {
    MODE: 3
  },
  props: {
    id: String,
    label: { type: String, default: '' },
    description: { type: String, default: '' },
    titleFieldCls: Object,
    descriptionFieldCls: Object,
    orderedProperties: { type: Array, required: true },
    required: { type: Boolean, default: false }
  },
  computed: {
    fieldTitleId() {
      return `${this.id}__title`;
    },
    fieldDescriptionId() {
      return `${this.id}__description`;
    }
  }
};
</script>
