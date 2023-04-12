<template>
  <div class="row">
    <p class="col-xs-3 col-xs-offset-9 text-right">
      <icon-button
        type="info"
        icon="plus"
        class="btn-add col-xs-12"
        tab-index="0"
        :disabled="disabled"
	@click="$emit('click', $event)"
      />
    </p>
  </div>
</template>

<script>
import IconButton from './IconButton';

const PROPS = {
  disabled: { type: Boolean, default: false }
};

export default {
  name: 'AddButton',
  components: {
    'icon-button': IconButton
  },
  props: PROPS
};
</script>
