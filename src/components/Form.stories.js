import JsonForm from './Form';
import simpleData from './Form.stories.data/simple';
import ifThen from './Form.stories.data/if-then';
import autofocus from './Form.stories.data/autofocus';

export default {
  title: 'Form',
  component: JsonForm,
  render: (args) => ({
    components: {
      JsonForm
    },
    setup() {
      return { ...args };
    },
    template: `
      <json-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" live-validate :omit-missing-fields="omitMissingFields" />
    `
  })
};

export const AutoFocus = {
  args: {
    ...autofocus,
    omitMissingFields: false
  }
};

export const AutoFocusWithoutMissingFields = {
  args: {
    ...autofocus,
    omitMissingFields: true
  }
};

export const IfThen = {
  args: {
    ...ifThen,
    omitMissingFields: false
  }
};

export const Simple = {
  args: {
    ...simpleData,
    omitMissingFields: false
  }
};
