import { getUiOptions } from '../utils';

export const canAddArrayItem = (uiSchema, schema, formData) => {
  const { addable } = getUiOptions(uiSchema);
  if (typeof addable === 'boolean') {
    return addable;
  }
  return schema.maxItems !== undefined ? formData.length < schema.maxItems : true;
};
