import ChildListLayout from './custom-layout/child-list-layout.vue';
import MainVacancyLayout from './custom-layout/main-vacancy-layout.vue';

const schema = {
  type: 'object',
  properties: {
    position: {
      type: 'string',
      title: 'position'
    },
    body: {
      type: 'string',
      title: 'body'
    },
    visibility: {
      title: 'visibility',
      type: 'number',
      enum: [1, 2] // кек, 0 не выводится, надо чинить
    },
    children: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          account_division: {
            type: 'number',
            title: 'account_division',
            isNotEmpty: true
          },
          money: {
            type: 'string',
            title: 'money'
          },
          priority: {
            type: 'number',
            enum: [1, 2],
            title: 'priority'
          },
          fill_quotas: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                num: {
                  type: 'number'
                },
                date: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  }
};

const uiSchema = {
  'ui:ObjectFieldTemplate': MainVacancyLayout,
  position: {
    'ui:widget': 'TextWidget',
    'ui:options': {
      name: 'position',
      isVisible: true,
      required: true
    }
  },
  body: {
    'ui:widget': 'TextareaWidget'
  },
  children: {
    'ui:ArrayFieldTemplate': ChildListLayout,
    items: {
      // 'ui:ObjectFieldTemplate': ChildLayout,
      account_division: {
        'ui:widget': 'TextWidget',
        'ui:options': {
          name: 'account_division',
          dictionaryId: 'systemDivisions',
          isVisible: true,
          required: true
        }
      }
    }
  }
};

const formData = {
  children: [
    { account_division: 1, money: '111' },
    { account_division: 1, money: '112' },
    { account_division: 1, money: '113' },
    { account_division: 1, money: '114' },
    { account_division: 1, money: '115' },
    { account_division: 1, money: '116' },
    { account_division: 1, money: '117' },
    { account_division: 1, money: '118' },
    { account_division: 1, money: '119' },
    { account_division: 1, money: '120' },
    { account_division: 1, money: '121' },
    { account_division: 1, money: '122' },
    { account_division: 1, money: '123' },
    { account_division: 1, money: '124' },
    { account_division: 1, money: '125' },
    { account_division: 1, money: '126' },
    { account_division: 1, money: '127' },
    { account_division: 1, money: '128' },
    { account_division: 1, money: '129' },
    { account_division: 1, money: '130' },
    { account_division: 1, money: '131' },
    { account_division: 1, money: '132' },
    { account_division: 1, money: '133' },
    { account_division: 1, money: '134' },
    { account_division: 1, money: '135' },
    { account_division: 1, money: '136' },
    { account_division: 1, money: '137' },
    { account_division: 1, money: '138' },
    { account_division: 1, money: '139' },
    { account_division: 1, money: '140' },
    { account_division: 1, money: '112' },
    { account_division: 1, money: '113' },
    { account_division: 1, money: '114' },
    { account_division: 1, money: '115' },
    { account_division: 1, money: '116' },
    { account_division: 1, money: '117' },
    { account_division: 1, money: '118' },
    { account_division: 1, money: '119' },
    { account_division: 1, money: '120' },
    { account_division: 1, money: '121' },
    { account_division: 1, money: '122' },
    { account_division: 1, money: '123' },
    { account_division: 1, money: '124' },
    { account_division: 1, money: '125' },
    { account_division: 1, money: '126' },
    { account_division: 1, money: '127' },
    { account_division: 1, money: '128' },
    { account_division: 1, money: '129' },
    { account_division: 1, money: '130' },
    { account_division: 1, money: '131' },
    { account_division: 1, money: '132' },
    { account_division: 1, money: '133' },
    { account_division: 1, money: '134' },
    { account_division: 1, money: '135' },
    { account_division: 1, money: '136' },
    { account_division: 1, money: '137' },
    { account_division: 1, money: '138' },
    { account_division: 1, money: '139' },
    { account_division: 1, money: '140' },
    { account_division: 1, money: '112' },
    { account_division: 1, money: '113' },
    { account_division: 1, money: '114' },
    { account_division: 1, money: '115' },
    { account_division: 1, money: '116' },
    { account_division: 1, money: '117' },
    { account_division: 1, money: '118' },
    { account_division: 1, money: '119' },
    { account_division: 1, money: '120' },
    { account_division: 1, money: '121' },
    { account_division: 1, money: '122' },
    { account_division: 1, money: '123' },
    { account_division: 1, money: '124' },
    { account_division: 1, money: '125' },
    { account_division: 1, money: '126' },
    { account_division: 1, money: '127' },
    { account_division: 1, money: '128' },
    { account_division: 1, money: '129' },
    { account_division: 1, money: '130' },
    { account_division: 1, money: '131' },
    { account_division: 1, money: '132' },
    { account_division: 1, money: '133' },
    { account_division: 1, money: '134' },
    { account_division: 1, money: '135' },
    { account_division: 1, money: '136' },
    { account_division: 1, money: '137' },
    { account_division: 1, money: '138' },
    { account_division: 1, money: '139' },
    { account_division: 1, money: '140' },
    { account_division: 1, money: '112' },
    { account_division: 1, money: '113' },
    { account_division: 1, money: '114' },
    { account_division: 1, money: '115' },
    { account_division: 1, money: '116' },
    { account_division: 1, money: '117' },
    { account_division: 1, money: '118' },
    { account_division: 1, money: '119' },
    { account_division: 1, money: '120' },
    { account_division: 1, money: '121' },
    { account_division: 1, money: '122' },
    { account_division: 1, money: '123' },
    { account_division: 1, money: '124' },
    { account_division: 1, money: '125' },
    { account_division: 1, money: '126' },
    { account_division: 1, money: '127' },
    { account_division: 1, money: '128' },
    { account_division: 1, money: '129' },
    { account_division: 1, money: '130' },
    { account_division: 1, money: '131' },
    { account_division: 1, money: '132' },
    { account_division: 1, money: '133' },
    { account_division: 1, money: '134' },
    { account_division: 1, money: '135' },
    { account_division: 1, money: '136' },
    { account_division: 1, money: '137' },
    { account_division: 1, money: '138' },
    { account_division: 1, money: '139' },
    { account_division: 1, money: '140' },
    { account_division: 1, money: '112' },
    { account_division: 1, money: '113' },
    { account_division: 1, money: '114' },
    { account_division: 1, money: '115' },
    { account_division: 1, money: '116' },
    { account_division: 1, money: '117' },
    { account_division: 1, money: '118' },
    { account_division: 1, money: '119' },
    { account_division: 1, money: '120' },
    { account_division: 1, money: '121' },
    { account_division: 1, money: '122' },
    { account_division: 1, money: '123' },
    { account_division: 1, money: '124' },
    { account_division: 1, money: '125' },
    { account_division: 1, money: '126' },
    { account_division: 1, money: '127' },
    { account_division: 1, money: '128' },
    { account_division: 1, money: '129' },
    { account_division: 1, money: '130' },
    { account_division: 1, money: '131' },
    { account_division: 1, money: '132' },
    { account_division: 1, money: '133' },
    { account_division: 1, money: '134' },
    { account_division: 1, money: '135' },
    { account_division: 1, money: '136' },
    { account_division: 1, money: '137' },
    { account_division: 1, money: '138' },
    { account_division: 1, money: '139' },
    { account_division: 1, money: '140' },
    { account_division: 1, money: '112' },
    { account_division: 1, money: '113' },
    { account_division: 1, money: '114' },
    { account_division: 1, money: '115' },
    { account_division: 1, money: '116' },
    { account_division: 1, money: '117' },
    { account_division: 1, money: '118' },
    { account_division: 1, money: '119' },
    { account_division: 1, money: '120' },
    { account_division: 1, money: '121' },
    { account_division: 1, money: '122' },
    { account_division: 1, money: '123' },
    { account_division: 1, money: '124' },
    { account_division: 1, money: '125' },
    { account_division: 1, money: '126' },
    { account_division: 1, money: '127' }
  ]
};

export default {
  schema,
  uiSchema,
  formData
};
