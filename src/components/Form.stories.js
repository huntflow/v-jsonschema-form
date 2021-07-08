import { storiesOf } from '@storybook/vue';
import JsonForm from './Form';
import simpleData from './Form.stories.data/simple';
import nestedData from './Form.stories.data/nested';
import arraysData from './Form.stories.data/arrays';
import orderingData from './Form.stories.data/ordering';
import referencesData from './Form.stories.data/references';
import numbersData from './Form.stories.data/numbers';
import anyOfData from './Form.stories.data/anyOf';
import availableOn from './Form.stories.data/available-on';
import ifThen from './Form.stories.data/if-then';

const components = {
  'json-form': JsonForm
};

storiesOf('JsonForm', JsonForm)
  .add('If then', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate></json-form>',
    data() {
      return ifThen;
    }
  }))
  .add('Simple', () => ({
    components,
    template:
        '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate></json-form>',
    data() {
      return simpleData;
    }
  }))
  .add('Start validate after form submitted', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate start-validate-mode="onSubmit"></json-form>',
    data() {
      return simpleData;
    }
  }))
  .add('Nested', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate></json-form>',
    data() {
      return nestedData;
    }
  }))
  .add('Arrays', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate></json-form>',
    data() {
      return arraysData;
    }
  }))
  .add('Ordering', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate></json-form>',
    data() {
      return orderingData;
    }
  }))
  .add('References', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate></json-form>',
    data() {
      return referencesData;
    }
  }))
  .add('Numbers', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate></json-form>',
    data() {
      return numbersData;
    }
  }))
  .add('Any of', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate></json-form>',
    data() {
      return anyOfData;
    }
  }))
  .add('Available on', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate></json-form>',
    data() {
      return availableOn;
    }
  }));
