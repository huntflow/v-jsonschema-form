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
  methods: {
    isDisabled(option) {
      return this.disabled || this.readonly;
    },
    isChecked(option) {
      return this.value === option;
    }
  },

  render(h) {
    const { id, options, autofocus } = this.$props;
    const { inline } = options;
    const name = Math.random().toString();

    const makeRadio = ({ index, option }) =>
      h('span', {}, [
        h('input', {
          on: {
            ...this.$listeners,
            change: () => this.$emit('change', option)
          },
          attrs: {
            type: 'radio',
            checked: this.isChecked(option),
            name,
            disabled: this.isDisabled(option),
            required: this.required,
            autofocus: autofocus && index === 0,
            value: option
          }
        }),
        h('span', {}, [option])
      ]);

    return h('div', { attrs: { id } }, [
      ...this.schema.enum.map((option, index) => {
        const checkbox = [makeRadio({ option, index })];
        const attrs = inline
          ? { class: `radio-inline` }
          : { class: `radio` };

        return inline
          ? h('label', { key: index, attrs }, checkbox)
          : h('div', { key: index, attrs }, [h('label', {}, checkbox)]);
      })
    ]);
  }
};
</script>
