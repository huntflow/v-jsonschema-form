import DefaultErrorList from './ErrorList.vue';

export const PROPS = {
  id: String,
  idPrefix: String,
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
  disabled: { type: Boolean, default: false },
  noHtml5Validate: { type: Boolean, default: false },
  ErrorList: { type: Object, default: () => DefaultErrorList },
  omitExtraData: { type: Boolean, default: false },
  fields: { type: Object, default: () => ({}) },
  widgets: { type: Object, default: () => ({}) },
  omitMissingFields: { type: Boolean, default: false }
};
