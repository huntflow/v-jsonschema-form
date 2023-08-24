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

const CONDITIONAL_KEYWORDS = [/*'not', 'anyOf', 'oneOf',*/ 'allOf', 'if'];

const KEYWORDS_FOR_RESOLVING = ['$ref'].concat(CONDITIONAL_KEYWORDS);

export function resolveSchemaShallowly(schema, { getSchema, data, skipCopy = false }) {
  if (!KEYWORDS_FOR_RESOLVING.some((keyword) => keyword in schema)) {
    return schema;
  }
  const resolvedSchema = skipCopy ? schema : cloneDeep(schema);

  if (resolvedSchema.$ref) {
    merge(resolvedSchema, getSchema(resolvedSchema.$ref).schema);
    delete resolvedSchema.$ref;
  }
  if (resolvedSchema.allOf) {
    resolvedSchema.allOf.forEach((cond) => {
      merge(resolvedSchema, resolveSchemaShallowly(cond, { getSchema, data, skipCopy: true }));
    });
    delete resolvedSchema.allOf;
  }
  if (resolvedSchema.if) {
    const validate = getSchema(resolvedSchema.if.$id);
    if (validate(data)) {
      merge(resolvedSchema, resolvedSchema.then);
    } else {
      merge(resolvedSchema, resolvedSchema.else);
    }
    delete resolvedSchema.if;
    delete resolvedSchema.then;
    delete resolvedSchema.else;
  }
  delete resolvedSchema.$id;
  return resolvedSchema;
}

export function removeEmptySchemaFields(schema, { data = {} }) {
  if (!schema.properties || !Object.keys(schema.properties).length) {
    return schema;
  }
  const resultSchema = cloneDeep(schema);
  Object.keys(schema.properties).forEach((property) => {
    const value = data[property];
    if ([undefined, null, ''].includes(value) || (Array.isArray(value) && !value.length)) {
      delete resultSchema.properties[property];
    }
  });
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
      if (parentKeyword && !schema.hasOwnProperty('default')) {
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
