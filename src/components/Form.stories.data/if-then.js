const schema = {
  type: 'object',
  properties: {
    title: {
      type: 'string'
    },
    street_address: {
      type: 'string'
    },
    country: {
      default: 'United States of America',
      enum: ['United States of America, Canada']
    },
    nested: {
      type: 'object',
      properties: {
        a: { type: 'string', minLength: 2 }
      },
      required: ['a']
    }
  },
  if: {
    properties: {
      country: { const: 'United States of America' }
    }
  },
  then: {
    properties: { postal_code: { type: 'string' } },
    required: ['postal_code']
  },
  else: {
    properties: { postal_code_else: { type: 'string' } },
    required: ['postal_code_else']
  }
};

const formData = {};

const uiSchema = {};

export default {
  schema,
  uiSchema,
  formData
};
