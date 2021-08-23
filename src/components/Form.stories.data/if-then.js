const schema = {
  type: 'object',
  properties: {
    field_a: {
      default: '1',
      enum: ['1', '2', '3', '4', '5']
    },
    field_b: {
      default: '1',
      enum: ['1', '2']
    }
  },
  allOf: [
    {
      if: {
        properties: {
          field_a: { const: '1' }
        }
      },
      then: {
        properties: { dependency_a_1: { type: 'string' } }
      }
    },
    {
      if: {
        properties: {
          field_a: {
            valid_against_value: {
              operator: '==',
              value: ['3', '4']
            }
          }
        }
      },
      then: {
        properties: { dependency_a_3: { type: 'string' } }
      }
    },
    {
      if: {
        properties: {
          field_a: {
            valid_against_value: {
              operator: '!=',
              value: ['1', '2', '3']
            }
          }
        }
      },
      then: {
        properties: { dependency_a_4: { type: 'string' } }
      }
    },
    {
      if: {
        properties: {
          field_b: { const: '1' }
        }
      },
      then: {
        properties: { dependency_b_1: { type: 'string' } }
      }
    }
  ]
};

const formData = {};

const uiSchema = {};

export default {
  schema,
  uiSchema,
  formData
};
