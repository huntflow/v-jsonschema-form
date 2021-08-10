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
      minLength: 3
    }
  }
};

const uiSchema = {
  firstName: {
    'ui:options': {
      name: 'firstName'
    }
  },
  lastName: {
    'ui:options': {
      name: 'lastName',
      'aria-invalid': true
    }
  }
};

const formData = {};

export default {
  schema,
  uiSchema,
  formData
};
