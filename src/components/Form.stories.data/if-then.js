const schema = {
  type: 'object',
  properties: {
    field_a: {
      default: '1',
      enum: ['1', '2']
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
