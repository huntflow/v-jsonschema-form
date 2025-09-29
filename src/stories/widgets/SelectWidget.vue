<template>
  <div>
    <pre>{{ pointer }}</pre>
    <pre>{{ schema }}</pre>
    <select @change.stop.prevent="handleChange">
      <option
        :key="item"
        v-for="item in schema.enum"
        :value="item"
        :selected="value === item"
      >
        {{ item }}
      </option>
    </select>
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

const handleChange = (event) => {
  setFormDataByPointer(props.pointer, event.target.value, {
    schema: props.schema
  });
};
</script>
