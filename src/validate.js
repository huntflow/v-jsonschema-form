import Ajv from 'ajv';
import get from 'lodash/get';
import ajvErrors from 'ajv-errors';
import jsonPointer from 'json-pointer';

export function compileSchema({
  schema,
  customFormats = {},
  transformErrors,
  removeAdditional = false,
  useDefaults
}) {
  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
    removeAdditional,
    strictSchema: false, // т.к. мы валидируем вложенную структуру, то может ругаться на `default` свойство, если оно на корневом объекте
    useDefaults,
    multipleOfPrecision: 8
  });

  ajvErrors(ajv);

  ajv.addKeyword({
    keyword: 'valid_against_value',
    validate: function validAgainstValue(kwValue, data) {
      const expectedValues = Array.isArray(kwValue.value) ? kwValue.value : [kwValue.value];
      const values = Array.isArray(data) ? data : [data];

      if (kwValue.operator === '==') {
        return values.some((val) => expectedValues.includes(val));
      }
      if (kwValue.operator === '!=') {
        return values.every((val) => !expectedValues.includes(val));
      }
      return true;
    }
  });

  ajv.addKeyword({
    keyword: 'valid_against_dictionary',
    validate: function validAgainstDictionary(kwValue, data) {
      const expectedValues = Array.isArray(kwValue.value) ? kwValue.value : [kwValue.value];
      const fields = (Array.isArray(data) ? data : [data]).map((dictFieldId) => {
        return kwValue.dictionary.find(({ id }) => id === parseInt(dictFieldId));
      });
      const path = kwValue.path || 'id';
      if (kwValue.operator === '==') {
        return fields.some((field) => expectedValues.includes(get(field, path)));
      }
      if (kwValue.operator === '!=') {
        return fields.every((field) => !expectedValues.includes(get(field, path)));
      }
      return true;
    }
  });

  ajv.addKeyword({
    keyword: 'isNotEmpty',
    errors: true,
    validate: function isNotEmpty(value, data) {
      if (!value) {
        return true;
      }
      if (Array.isArray(isNotEmpty.errors) === false) {
        isNotEmpty.errors = [];
      }
      const isValid =
        (typeof data === 'string' && data.trim() !== '') ||
        typeof data === 'number' ||
        (Array.isArray(data) && data.length > 0);
      !isValid &&
        isNotEmpty.errors.push({
          keyword: 'isNotEmpty',
          message: 'should NOT be empty',
          params: {
            keyword: 'isNotEmpty'
          }
        });
      return isValid;
    }
  });

  ajv.addFormat('data-url', /^data:([a-z]+\/[a-z0-9-+.]+)?;(?:name=(.*);)?base64,(.*)$/);
  ajv.addFormat(
    'color',
    /^(#?([0-9A-Fa-f]{3}){1,2}\b|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow|(rgb\(\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*,\s*\b([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\b\s*\))|(rgb\(\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*,\s*(\d?\d%|100%)+\s*\)))$/
  );
  ajv.addFormat('uri', /^[a-z]+:\/\/([^/:]+)(:[0-9]+)?(\/.*)?$/);

  Object.keys(customFormats).forEach((formatName) => {
    ajv.addFormat(formatName, customFormats[formatName]);
  });

  const validate = ajv.compile(schema);

  return {
    validate,
    getSchema: ajv.getSchema.bind(ajv),
    getErrorData() {
      let errors = transformAjvErrors(validate.errors);
      if (typeof transformErrors === 'function') {
        errors = transformErrors(errors);
      }

      let errorSchema = toErrorSchema(errors);

      return { errors, errorSchema };
    }
  };
}

function toErrorSchema(errors) {
  // Transforms a ajv validation errors list:
  // [
  //   {property: ".level1.level2[2].level3", message: "err a"},
  //   {property: ".level1.level2[2].level3", message: "err b"},
  //   {property: ".level1.level2[4].level3", message: "err b"},
  // ]
  // Into an error tree:
  // {
  //   level1: {
  //     level2: {
  //       2: {level3: {errors: ["err a", "err b"]}},
  //       4: {level3: {errors: ["err b"]}},
  //     }
  //   }
  // };
  if (!errors.length) {
    return {};
  }
  return errors.reduce((errorSchema, error) => {
    jsonPointer.set(errorSchema, `${error.instancePath}/-`, error);
    return errorSchema;
  }, {});
}

/**
 * Transforming the error output from ajv to format used by jsonschema.
 * At some point, components should be updated to support ajv.
 */
function transformAjvErrors(errors = []) {
  if (errors === null) {
    return [];
  }

  return errors.reduce((res, { instancePath, keyword, message, params, schemaPath }) => {
    if (params.failingKeyword) {
      // кажется что нет смысла это логировать, пока увидел keyword `then`, но вряд-ли это можно считать ошибкой
      // console.log(`failing keyword ${params.failingKeyword} by path ${schemaPath}`);
      return res;
    }

    const fullInstancePath = params.missingProperty
      ? `${instancePath}/${params.missingProperty}`
      : instancePath;

    const property = jsonPointer.parse(fullInstancePath).join('.');

    res.push({
      name: keyword,
      property,
      message,
      params, // specific to ajv
      stack: `${property} ${message}`.trim(),
      instancePath: fullInstancePath,
      schemaPath
    });

    return res;
  }, []);
}
