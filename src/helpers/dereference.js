import $RefParser from 'json-schema-ref-parser';

export function dereference(schema) {
  return $RefParser.dereference(schema, {
    parse: {
      json: false,
      yaml: false,
      text: false,
      binary: false
    },
    resolve: {
      external: false,
      file: false,
      http: false
    }
  }).then((result) => {
    const { definitions, ...rest } = result;
    return rest;
  });
}
