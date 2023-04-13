import fields from './components/fields';
import widgets from './components/widgets';
export const ADDITIONAL_PROPERTY_FLAG = '__additional_property';

const widgetMap = {
  boolean: {
    checkbox: 'CheckboxWidget',
    radio: 'RadioWidget',
    select: 'SelectWidget',
    hidden: 'HiddenWidget'
  },
  string: {
    text: 'TextWidget',
    password: 'PasswordWidget',
    email: 'EmailWidget',
    hostname: 'TextWidget',
    ipv4: 'TextWidget',
    ipv6: 'TextWidget',
    uri: 'URLWidget',
    'data-url': 'FileWidget',
    radio: 'RadioWidget',
    select: 'SelectWidget',
    textarea: 'TextareaWidget',
    hidden: 'HiddenWidget',
    date: 'DateWidget',
    datetime: 'DateTimeWidget',
    'date-time': 'DateTimeWidget',
    'alt-date': 'AltDateWidget',
    'alt-datetime': 'AltDateTimeWidget',
    color: 'ColorWidget',
    file: 'FileWidget'
  },
  number: {
    text: 'TextWidget',
    select: 'SelectWidget',
    updown: 'UpDownWidget',
    range: 'RangeWidget',
    radio: 'RadioWidget',
    hidden: 'HiddenWidget'
  },
  integer: {
    text: 'TextWidget',
    select: 'SelectWidget',
    updown: 'UpDownWidget',
    range: 'RangeWidget',
    radio: 'RadioWidget',
    hidden: 'HiddenWidget'
  },
  array: {
    select: 'SelectWidget',
    checkboxes: 'CheckboxesWidget',
    files: 'FileWidget',
    hidden: 'HiddenWidget'
  }
};

export function getDefaultRegistry() {
  return {
    fields,
    widgets,
    formContext: {}
  };
}

export function getSchemaType(schema) {
  let { type } = schema;

  if (!type && schema.const) {
    return guessType(schema.const);
  }

  if (!type && schema.enum) {
    return 'string'; // TODO: кажется что тут нужно вычислять через `guessType`
  }

  if (!type && schema.properties) {
    return 'object';
  }

  if (type instanceof Array && type.length === 2 && type.includes('null')) {
    return type.find((type) => type !== 'null');
  }

  return type;
}

export function getWidget(schema, widget, registeredWidgets = {}) {
  if (typeof widget === 'object') {
    return widget;
  }

  const type = getSchemaType(schema);

  if (typeof widget !== 'string') {
    throw new Error(`Unsupported widget definition: ${typeof widget}`);
  }

  // eslint-disable-next-line no-prototype-builtins
  if (registeredWidgets.hasOwnProperty(widget)) {
    const registeredWidget = registeredWidgets[widget];
    return getWidget(schema, registeredWidget, registeredWidgets);
  }
  // eslint-disable-next-line no-prototype-builtins
  if (!widgetMap.hasOwnProperty(type)) {
    throw new Error(`No widget for type "${type}"`);
  }

  // eslint-disable-next-line no-prototype-builtins
  if (widgetMap[type].hasOwnProperty(widget)) {
    const registeredWidget = registeredWidgets[widgetMap[type][widget]];
    return getWidget(schema, registeredWidget, registeredWidgets);
  }

  throw new Error(`No widget "${widget}" for type "${type}"`);
}

export function hasWidget(schema, widget, registeredWidgets = {}) {
  try {
    getWidget(schema, widget, registeredWidgets);
    return true;
  } catch (e) {
    if (
      e.message &&
      (e.message.startsWith('No widget') || e.message.startsWith('Unsupported widget'))
    ) {
      return false;
    }
    throw e;
  }
}

export function getUiOptions(uiSchema) {
  // get all passed options from ui:widget, ui:options, and ui:<optionName>
  return Object.keys(uiSchema)
    .filter((key) => key.indexOf('ui:') === 0)
    .reduce((options, key) => {
      const value = uiSchema[key];

      if (key === 'ui:widget' && isObject(value)) {
        console.warn('Setting options via ui:widget object is deprecated, use ui:options instead');
        return {
          ...options,
          ...(value.options || {}),
          widget: value.component
        };
      }
      if (key === 'ui:options' && isObject(value)) {
        return { ...options, ...value };
      }
      return { ...options, [key.substring(3)]: value };
    }, {});
}

export function isObject(thing) {
  if (typeof File !== 'undefined' && thing instanceof File) {
    return false;
  }
  return typeof thing === 'object' && thing !== null && !Array.isArray(thing);
}

export function asNumber(value) {
  if (value === '') {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  if (/\.$/.test(value)) {
    // "3." can't really be considered a number even if it parses in js. The
    // user is most likely entering a float.
    return value;
  }
  if (/\.0$/.test(value)) {
    // we need to return this as a string here, to allow for input like 3.07
    return value;
  }
  const n = Number(value);
  const valid = typeof n === 'number' && !Number.isNaN(n);

  if (/\.\d*0$/.test(value)) {
    // It's a number, that's cool - but we need it as a string so it doesn't screw
    // with the user when entering dollar amounts or other values (such as those with
    // specific precision or number of significant digits)
    return value;
  }

  return valid ? n : value;
}

export function orderProperties(properties, order) {
  if (!Array.isArray(order)) {
    return properties;
  }

  const arrayToHash = (arr) =>
    arr.reduce((prev, curr) => {
      prev[curr] = true;
      return prev;
    }, {});
  const errorPropList = (arr) =>
    arr.length > 1 ? `properties '${arr.join("', '")}'` : `property '${arr[0]}'`;
  const propertyHash = arrayToHash(properties);
  const extraneous = order.filter((prop) => prop !== '*' && !propertyHash[prop]);
  if (extraneous.length) {
    console.warn(`uiSchema order list contains extraneous ${errorPropList(extraneous)}`);
  }
  const orderFiltered = order.filter((prop) => prop === '*' || propertyHash[prop]);
  const orderHash = arrayToHash(orderFiltered);

  const rest = properties.filter((prop) => !orderHash[prop]);
  const restIndex = orderFiltered.indexOf('*');
  if (restIndex === -1) {
    if (rest.length) {
      throw new Error(`uiSchema order list does not contain ${errorPropList(rest)}`);
    }
    return orderFiltered;
  }
  if (restIndex !== orderFiltered.lastIndexOf('*')) {
    throw new Error('uiSchema order list contains more than one wildcard item');
  }

  const complete = [...orderFiltered];
  complete.splice(restIndex, 1, ...rest);
  return complete;
}

export function toConstant(schema) {
  if (Array.isArray(schema.enum) && schema.enum.length === 1) {
    return schema.enum[0];
    // eslint-disable-next-line no-prototype-builtins
  } else if (schema.hasOwnProperty('const')) {
    return schema.const;
  } else {
    throw new Error('schema cannot be inferred as a constant');
  }
}

export function isSelect(schema) {
  return !!Array.isArray(schema.enum);
}

export function isMultiSelect(schema) {
  if (!schema.uniqueItems || !schema.items) {
    return false;
  }
  return isSelect(schema.items);
}

export function isFixedItems(schema) {
  return (
    Array.isArray(schema.items) &&
    schema.items.length > 0 &&
    schema.items.every((item) => isObject(item))
  );
}

export function allowAdditionalItems(schema) {
  if (schema.additionalItems === true) {
    console.warn('additionalItems=true is currently not supported');
  }
  return isObject(schema.additionalItems);
}

export function optionsList(schema) {
  if (schema.enum) {
    return schema.enum.map((value, i) => {
      const label = (schema.enumNames && schema.enumNames[i]) || String(value);
      return { label, value };
    });
  }
  return [];
}

// In the case where we have to implicitly create a schema, it is useful to know what type to use
//  based on the data we are defining
export const guessType = function guessType(value) {
  if (Array.isArray(value)) {
    return 'array';
  } else if (typeof value === 'string') {
    return 'string';
  } else if (value == null) {
    return 'null';
  } else if (typeof value === 'boolean') {
    return 'boolean';
  } else if (!isNaN(value)) {
    return 'number';
  } else if (typeof value === 'object') {
    return 'object';
  }
  // Default to string if we can't figure it out
  return 'string';
};

export function rangeSpec(schema) {
  const spec = {};
  if (schema.multipleOf) {
    spec.step = schema.multipleOf;
  }
  if (schema.minimum || schema.minimum === 0) {
    spec.min = schema.minimum;
  }
  if (schema.maximum || schema.maximum === 0) {
    spec.max = schema.maximum;
  }
  return spec;
}
