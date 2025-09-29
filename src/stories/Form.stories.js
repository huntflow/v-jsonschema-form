import { fn } from 'storybook/test';

import VjsfForm from '../components/Form.vue';
import TextWidget from './widgets/TextWidget.vue';
import SelectWidget from './widgets/SelectWidget.vue';


export default {
  title: 'Base/VjsfForm',
  component: VjsfForm,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  render: (args) => ({
    // Components used in your story `template` are defined in the `components` object
    components: {
      VjsfForm,
    },
    // The story's `args` need to be mapped into the template through the `setup()` method
    setup() {
      // Story args can be spread into the returned object
      return {
        ...args,
      };
    },
    // Then, the spread values can be accessed directly in the template
    template: '<vjsf-form :schema="schema" :ui-schema="uiSchema" :form-data="formData" :widgets="widgets" />',
  }),
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    onFocus: fn(),
    onBlur: fn(),
    onChange: fn(),
    onSubmit: fn()
  },
};


export const Base = {
  args: {
    widgets: {
      TextWidget: TextWidget,
      SelectWidget: SelectWidget
    },
    schema: {
      type: 'object',
      required: [],
      properties: {
        yes_no_condition_0: {
          type: 'string',
          enum: ['yes0', 'no0']
        }
      },
      allOf: [
        {
          if: {
            properties: {
              yes_no_condition_0: { 'const': 'yes0'}
            },
            required: ['yes_no_condition_0']
          },
          then: {
            properties: {
              block: {
                type: 'object',
                properties: {
                  yes_no_condition_1: {
                    type: 'string',
                    enum: ['yes1', 'no1']
                  }
                },
                allOf: [
                  {
                    if: {
                      properties: {
                        yes_no_condition_1: { 'const': 'yes1'}
                      },
                      required: ['yes_no_condition_1']
                    },
                    then: {
                      properties: {
                        a: {
                          type: 'string'
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      ]
    },
    uiSchema: {
      'ui:order': ['yes_no_condition_0', 'block'],
      yes_no_condition_0: {
        'ui:widget': 'SelectWidget'
      },
      block: {
        'ui:order': ['yes_no_condition_1', 'a'],
        yes_no_condition_1: {
          'ui:widget': 'SelectWidget'
        },
        a: {
          'ui:widget': 'TextWidget',
        }
      }
    },
    formData: {
      yes_no_condition_0: 'yes0',
      block: {
        yes_no_condition_1: 'yes1',
        a: 'A'
      }
    }
  },
};
