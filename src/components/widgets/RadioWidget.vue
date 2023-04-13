<script>
const PROPS = {
  options: {},
  value: {},
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: false },
  id: String
};

export default {
  props: PROPS,
  emits: ['change'],
  methods: {
    isDisabled(option) {
      const itemDisabled =
        this.options.enumDisabled && this.options.enumDisabled.indexOf(option.value) != -1;
      return this.disabled || this.readonly || itemDisabled;
    },
    isChecked(option) {
      return this.value === option.value;
    }
  },

  render(h) {
    const { id, options, autofocus } = this.$props;
    const { enumOptions, inline } = options;
    const name = Math.random().toString();

    const makeRadio = ({ index, option }) =>
      h('span', {}, [
        h('input', {
          on: {
            focus: (evt) => this.$emit('focus', evt),
            blur: (evt) => this.$emit('blur', evt),
            change: () => this.$emit('change', option.value)
          },
          attrs: {
            type: 'radio',
            checked: this.isChecked(option),
            name,
            disabled: this.isDisabled(option),
            required: this.required,
            autofocus: autofocus && index === 0,
            value: option.value
          }
        }),
        h('span', {}, [option.label])
      ]);

    return h('div', { attrs: { id } }, [
      ...enumOptions.map((option, index) => {
        const disabledCls = this.isDisabled(option) ? 'disabled' : '';

        const checkbox = [makeRadio({ option, index })];
        const attrs = inline
          ? { class: `radio-inline ${disabledCls}` }
          : { class: `radio ${disabledCls}` };

        return inline
          ? h('label', { key: index, attrs }, checkbox)
          : h('div', { key: index, attrs }, [h('label', {}, checkbox)]);
      })
    ]);
  }
};
</script>
