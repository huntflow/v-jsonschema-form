import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import jsonSchemaTraverse from 'json-schema-traverse';
import jsonPointer from 'json-pointer';
import shortid from 'shortid';
import { getSchemaType } from '@/utils';

jsonSchemaTraverse.keywords.if = true;
jsonSchemaTraverse.keywords.additionalItems = true;
jsonSchemaTraverse.keywords.prefixItems = true;
jsonSchemaTraverse.arrayKeywords.prefixItems = true;

const CONDITIONAL_KEYWORDS = ['not', 'anyOf', 'oneOf', 'allOf', 'if'];

export function resolveSchemaShallowly(schema, { getSchema, data }) {
  if (!schema.$id) {
    return schema;
  }
  let resultSchema = cloneDeep(schema);
  if (resultSchema.allOf) {
    resultSchema.allOf.forEach((cond) => {
      merge(resultSchema, resolveSchemaShallowly(cond, { getSchema, data }));
    });
    delete resultSchema.allOf;
  }
  if (resultSchema.if) {
    const validate = getSchema(resultSchema.if.$id);
    if (validate(data)) {
      merge(resultSchema, resultSchema.then);
    } else {
      merge(resultSchema, resultSchema.else);
    }
    delete resultSchema.if;
    delete resultSchema.then;
    delete resultSchema.else;
  }
  return resultSchema;
}

export function getDefaults({ validate }, formData) {
  let data = cloneDeep(formData);
  const { schema } = validate;

  if ([null, undefined].includes(data)) {
    switch (getSchemaType(schema)) {
      case 'object':
        data = {};
        break;
      case 'array':
        data = [];
        break;
      default:
        data = schema.default || undefined;
        break;
    }
  }
  validate(data);

  return data;
}

export function getEnrichedSchema(schema) {
  let resultSchema = cloneDeep(schema);

  jsonSchemaTraverse(schema, {
    cb: (schema, currentJsonPointer, rootSchema, parentJsonPointer, parentKeyword) => {
      if (
        ['properties', 'prefixItems', 'additionalItems', 'items'].includes(parentKeyword) &&
        !schema.hasOwnProperty('default')
      ) {
        const schemaType = getSchemaType(schema);
        switch (schemaType) {
          case 'object':
            jsonPointer.set(resultSchema, `${currentJsonPointer}/default`, {});
            break;
          case 'array':
            jsonPointer.set(resultSchema, `${currentJsonPointer}/default`, []);
            break;
        }
      }
      if (
        CONDITIONAL_KEYWORDS.some((cond) => schema.hasOwnProperty(cond)) ||
        CONDITIONAL_KEYWORDS.includes(parentKeyword)
      ) {
        jsonPointer.set(resultSchema, `${currentJsonPointer}/$id`, shortid.generate());
      }
    }
  });

  return resultSchema;
}
