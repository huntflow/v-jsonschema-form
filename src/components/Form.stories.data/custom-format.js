const schema = {
  type: 'object',
  required: ['firstName', 'lastName'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First name'
    },
    lastName: {
      type: 'string',
      title: 'Last name',
      minLength: 3,
      format: 'my-format'
    }
  }
};

const uiSchema = {};

const formData = {};

export default {
  schema,
  uiSchema,
  formData,
  customFormats: {
    'my-format'(data) {
      return data === 'custom';
    }
  }
};
