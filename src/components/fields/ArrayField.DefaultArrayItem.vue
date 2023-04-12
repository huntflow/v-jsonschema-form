<template>
  <div>
    <div :class="hasToolbar ? 'col-xs-9' : 'col-xs-12'">
      <slot />
    </div>
    <div v-if="hasToolbar" class="col-xs-3 array-item-toolbox">
      <div class="btn-group" style="display: flex; justify-content: space-around">
        <icon-button
          v-if="hasMoveUp || hasMoveDown"
          icon="arrow-up"
          class="array-item-move-up"
          tab-index="-1"
          :style="btnStyle"
          :disabled="isDisabled || !hasMoveUp"
          @click="$emit('reorder', index, index - 1)"
        />

        <icon-button
          v-if="hasMoveUp || hasMoveDown"
          icon="arrow-down"
          class="array-item-movedown"
          tab-index="-1"
          :style="btnStyle"
          :disabled="isDisabled || !hasMoveDown"
          @click="$emit('reorder', index, index + 1)"
        />

        <icon-button
          v-if="hasRemove"
          type="danger"
          icon="remove"
          class="array-item-remove"
          tab-index="-1"
          :style="btnStyle"
          :disabled="isDisabled"
          @click="$emit('drop', index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import IconButton from '../IconButton';

const PROPS = {
  index: Number,
  hasToolbar: Boolean,
  hasMoveUp: Boolean,
  hasMoveDown: Boolean,
  hasRemove: Boolean,
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  onReorderClick: Function,
  onDropIndexClick: Function
};

export default {
  name: 'ArrayFieldDefaultArrayItem',
  components: {
    'icon-button': IconButton
  },
  props: PROPS,
  emits: ['reorder', 'drop'],
  data() {
    return {
      btnStyle: {
        flex: 1,
        paddingLeft: 6,
        paddingRight: 6,
        fontWeight: 'bold'
      }
    };
  },
  computed: {
    isDisabled() {
      return this.disabled || this.readonly;
    }
  }
};
</script>
