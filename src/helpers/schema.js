import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import get from 'lodash/get';
import jsonSchemaTraverse from 'json-schema-traverse';
import jsonPointer from 'json-pointer';
import { getSchemaType } from '@/utils';

jsonSchemaTraverse.keywords.if = true;

function omitKeys(schema) {
  return omit(schema, ['if', 'then', 'else']);
}

export function resolveSchema({ getSchema }, data) {
  const { schema } = getSchema();
  let resultSchema = cloneDeep(schema);

  jsonSchemaTraverse(schema, {
    cb: {
      post: (
        schema,
        currentJsonPointer,
        rootSchema,
        parentJsonPointer,
        parentKeyword,
        parentSchema,
        property
      ) => {
        if (parentKeyword === 'if') {
          jsonPointer.set(
            resultSchema,
            parentJsonPointer,
            resolveIfThenElse(getSchema, parentJsonPointer, { data })
          );
        }

        if (parentKeyword === 'allOf' && parentSchema.allOf.length === property + 1) {
          const { allOf, ...subSchema } = jsonPointer.get(resultSchema, parentJsonPointer);
          if (parentJsonPointer === '') {
            resultSchema = merge(subSchema, ...allOf);
          } else {
            jsonPointer.set(resultSchema, parentJsonPointer, merge(subSchema, ...allOf));
          }
        }
      }
    }
  });
  return resultSchema;
}

function resolveIfThenElse(getSchema, pointer, { data }) {
  const { schema } = getSchema(`#${pointer}`);
  const pointerParts = jsonPointer.parse(pointer);
  const dataParts = jsonPointer.parse(pointer).filter((part, index) => {
    if (['if', 'else', 'then', 'allOf', 'properties'].includes(part)) {
      return false;
    }
    return !(!Number.isNaN(Number(part)) && pointerParts[index - 1] === 'allOf');
  });
  const currentData = dataParts.length ? get(data, dataParts) : data;
  const validate = getSchema(`#${pointer}/if`);
  if (validate(currentData)) {
    return omitKeys(merge(schema, schema.then));
  }
  return omitKeys(merge(schema, schema.else));
}

export function getDefaults({ getSchema, validate }, formData) {
  let data = cloneDeep(formData);
  const { schema } = getSchema();

  if ([null, undefined].includes(data)) {
    switch (getSchemaType(schema)) {
      case 'object':
        data = {};
        break;
      case 'array':
        data = [];
        break;
    }
  }
  validate(data);

  return data;
}

export function getSchemaWithDefault(schema) {
  let resultSchema = cloneDeep(schema);

  jsonSchemaTraverse(schema, {
    cb: (schema, currentJsonPointer, rootSchema, parentJsonPointer, parentKeyword) => {
      if ('properties' !== parentKeyword || schema.hasOwnProperty('default')) {
        return;
      }
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
  });

  return resultSchema;
}
