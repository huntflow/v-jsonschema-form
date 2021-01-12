const schema = {
  definitions: {
    address: {
      type: 'object',
      properties: {
        street_address: {
          type: 'string'
        },
        city: {
          type: 'string'
        },
        state: {
          type: 'string'
        }
      },
      required: ['street_address', 'city', 'state']
    }
  },
  type: 'object',
  properties: {
    billing_address: {
      title: 'Billing address',
      $ref: '#/definitions/address'
    },
    shipping_address: {
      title: 'Shipping address',
      $ref: '#/definitions/address'
    }
  }
};

const uiSchema = {
  firstName: {
    'ui:autofocus': true,
    'ui:emptyValue': ''
  },
  age: {
    'ui:widget': 'updown',
    'ui:title': 'Age of person',
    'ui:description': '(earthian year)'
  },
  bio: {
    'ui:widget': 'textarea'
  },
  password: {
    'ui:widget': 'password',
    'ui:help': 'Hint: Make it strong!'
  },
  date: {
    'ui:widget': 'alt-datetime'
  },
  telephone: {
    'ui:options': {
      inputType: 'tel'
    }
  }
};

const formData = {
  billing_address: {
    street_address: '21, Jump Street',
    city: 'Babel',
    state: 'Neverland'
  },
  shipping_address: {
    street_address: '221B, Baker Street',
    city: 'London',
    state: 'N/A'
  }
};

export default {
  schema,
  uiSchema,
  formData
};
