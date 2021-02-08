const schema = {
  title: 'AvailableOn',
  description: 'Available on simple example',
  type: 'object',
  properties: {
    something: { type: 'string', enum: ['A', 'B', 'C'] }
  },
  allOf: [
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
  'ui:order': ['something_is_B', 'something', 'something_is_A'],
  something_is_B: {
    'ui:order': ['nested_bool_field', 'nested_enum_field', '*']
  }
};

const formData = {
};

export default {
  schema,
  uiSchema,
  formData
};
