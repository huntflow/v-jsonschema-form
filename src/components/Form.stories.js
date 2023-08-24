import { storiesOf } from '@storybook/vue';
import JsonForm from './Form';
import simpleData from './Form.stories.data/simple';
import nestedData from './Form.stories.data/nested';
import arraysData from './Form.stories.data/arrays';
import orderingData from './Form.stories.data/ordering';
import referencesData from './Form.stories.data/references';
import numbersData from './Form.stories.data/numbers';
import anyOfData from './Form.stories.data/anyOf';
import ifThen from './Form.stories.data/if-then';
import autofocus from './Form.stories.data/autofocus';
import customFormat from './Form.stories.data/custom-format';
import moreChildren from './Form.stories.data/more-children';

const components = {
  'json-form': JsonForm
};

storiesOf('JsonForm', JsonForm)
  .add('autofocus', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate></json-form>',
    data() {
      return autofocus;
    }
  }))
  .add('autofocus (exclude missing fields)', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate omit-missing-fields></json-form>',
    data() {
      return autofocus;
    }
  }))
  .add('custom format', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" :custom-formats="customFormats" live-validate></json-form>',
    data() {
      return customFormat;
    }
  }))
  .add('custom format (exclude missing fields)', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" :custom-formats="customFormats" live-validate omit-missing-fields></json-form>',
    data() {
      return customFormat;
    }
  }))
  .add('If then', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate></json-form>',
    data() {
      return ifThen;
    }
  }))
  .add('If then (exclude missing fields)', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate omit-missing-fields></json-form>',
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
  .add('Simple (exclude missing fields)', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate omit-missing-fields></json-form>',
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
  .add('Start validate after form submitted (exclude missing fields)', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate start-validate-mode="onSubmit" omit-missing-fields></json-form>',
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
  .add('Nested (exclude missing fields)', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate omit-missing-fields></json-form>',
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
  .add('Arrays (exclude missing fields)', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate omit-missing-fields></json-form>',
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
  .add('Ordering (exclude missing fields)', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate omit-missing-fields></json-form>',
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
  .add('References (exclude missing fields)', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate omit-missing-fields></json-form>',
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
  .add('Numbers (exclude missing fields)', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate omit-missing-fields></json-form>',
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
  .add('Any of (exclude missing fields)', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate omit-missing-fields></json-form>',
    data() {
      return anyOfData;
    }
  }))
  .add('moreChildren', () => ({
    components,
    template:
      '<json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData"></json-form>',
    data() {
      return moreChildren;
    }
  }));
