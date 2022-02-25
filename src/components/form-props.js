import { VALIDATION_MODE } from '../constants';
import DefaultErrorList from './ErrorList.vue';

export const PROPS = {
  id: String,
  idPrefix: { type: String, default: 'root' },
  name: String,
  method: String,
  target: String,
  action: String,
  autocomplete: String, // "on" / "off"
  enctype: String,
  acceptcharset: String,
  formData: [String, Number, Boolean, Array, Object],
  schema: { type: Object, default: () => ({}) },
  showErrorList: { type: Boolean, default: true },
  uiSchema: { type: Object, default: () => ({}) },
  noValidate: { type: Boolean, default: false },
  liveValidate: { type: Boolean, default: false },
  startValidateMode: {
    type: String,
    default: VALIDATION_MODE.onChange, //TODO: по хорошему поменять поведение по умолчанию на 'onSubmit'
    validator: (mode) => Object.values(VALIDATION_MODE).includes(mode)
  },
  disabled: { type: Boolean, default: false },
  noHtml5Validate: { type: Boolean, default: false },
  ErrorList: { type: Object, default: () => DefaultErrorList },
  omitExtraData: { type: Boolean, default: false },
  fields: { type: Object, default: () => ({}) },
  widgets: { type: Object, default: () => ({}) },
  omitMissingFields: { type: Boolean, default: false },
  customFormats: { type: Object, default: () => ({}) },
  fieldsSelector: { type: String, default: '[name]' },
  invalidFieldsSelector: { type: String, default: '[name][aria-invalid="true"]' }
};
