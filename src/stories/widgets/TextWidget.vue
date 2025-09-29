<template>
  <div>
    <pre>{{ pointer }}</pre>
    <pre>{{ schema }}</pre>
    <input
      type="text"
      :value="value"
      @input.stop.prevent="handleInput"
      @change.stop.prevent="handleInput"
    />
  </div>
</template>

<script setup>
import { inject } from 'vue';

const props = defineProps({
  pointer: String,
  value: String,
  schema: Object
});

const setFormDataByPointer = inject('setFormDataByPointer');

const handleInput = (event) => {
  setFormDataByPointer(props.pointer, event.target.value, {
    schema: props.schema
  });
};
</script>
