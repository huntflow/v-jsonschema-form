const schema = {
  title: 'AvailableOn',
  description: 'Available on simple example',
  type: 'object',
  properties: {
    something: { type: 'string', enum: ['A', 'B', 'C'] },
    dict: { type: 'number', enum: [10, 20, 30] }
  },
  allOf: [
    {
      anyOf: [
        {
          not: {
            properties: {
              dict: {
                type: 'number',
                valid_against_dictionary: {
                  dictionary: [
                    { id: 10, meta: { eta: 1 } },
                    { id: 20, meta: { eta: 2 } },
                    { id: 30, meta: { eta: 3 } }
                  ],
                  path: 'meta.eta',
                  value: 3,
                  operator: '=='
                }
              }
            }
          }
        },
        {
          properties: { dict_dependent_field: { type: 'string' } },
          required: ['dict']
        },
        {}
      ]
    },
    {
      anyOf: [
        {
          not: {
            properties: {
              something: { type: 'string', enum: ['A'] },
            }
          }
        },
        {
          properties: { something_is_A: { type: 'string' } },
          required: ['something']
        },
        {}
      ]
    },
    {
      anyOf: [
        {
          not: {
            properties: {
              something: { type: 'string', enum: ['B'] }
            }
          }
        },
        {
          properties: {
            something_is_B: {
              type: 'object',
              properties: {
                nested_enum_field: { enum: ['1', '2', '3'] },
                nested_bool_field: { type: 'boolean' }
              },
              allOf: [
                {
                  anyOf: [
                    {
                      not: {
                        not: { properties: { nested_enum_field: { enum: ['2'] } } }
                      }
                    },
                    {
                      properties: { nested_enum_field_is_not_2: { type: 'string' } },
                      required: ['nested_enum_field']
                    },
                    {}
                  ]
                },
                {
                  anyOf: [
                    {
                      not: {
                        properties: { nested_bool_field: { enum: [true] } }
                      }
                    },
                    {
                      properties: { nested_bool_field_is_true: { type: 'string' } },
                      required: ['nested_bool_field']
                    },
                    {}
                  ]
                }
              ]
            }
          },
          required: ['something']
        },
        {}
      ]
    }
  ]
};

const uiSchema = {
  'ui:order': ['dict', 'dict_dependent_field', 'something_is_B', 'something', 'something_is_A'],
  dict: {},
  dict_dependent_field: {},
  something_is_B: {
    'ui:order': ['nested_bool_field', 'nested_enum_field', '*']
  }
};

const formData = {};

export default {
  schema,
  uiSchema,
  formData
};
