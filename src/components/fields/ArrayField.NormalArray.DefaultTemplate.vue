<template>
  <fieldset :id="idSchema.$id">
    <slot name="title" />
    <slot name="description" />

    <div :key="'array-item-list-' + idSchema.$id" class="row array-item-list">
      <slot />
    </div>

    <add-button v-if="canAdd" class="array-item-add" :disabled="isDisabled" @click="$emit('add')" />
  </fieldset>
</template>

<script>
import AddButton from '../AddButton';

const PROPS = {
  idSchema: Object,
  schema: Object,
  uiSchema: Object,
  canAdd: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
};

export default {
  components: {
    'add-button': AddButton
  },
  props: PROPS,
  computed: {
    isDisabled() {
      return this.disabled || this.readonly;
    }
  }
};
</script>
