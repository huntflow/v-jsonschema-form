<script>
function selectValue(value, selected, all) {
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));
  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a, b) => all.indexOf(a) > all.indexOf(b));
}

function deselectValue(value, selected) {
  return selected.filter((v) => v !== value);
}

const PROPS = {
  schema: Object,
  id: String,
  autofocus: { default: false },
  options: { default: () => ({ inline: false }) },
  value: Array
};

export default {
  props: PROPS,
  emits: ['change'],
  methods: {
    isDisabled(option) {
      return this.disabled || this.readonly;
    },
    isChecked(option) {
      return this.value.indexOf(option) !== -1;
    }
  },

  render(h) {
    const { id, options, value, autofocus } = this.$props;
    const { inline } = options;

    const makeCheckbox = ({ index, option }) =>
      h('span', {}, [
        h('input', {
          on: {
            change: (event) => {
              const all = this.schema.enum;
              const changeValue = event.target.checked
                ? selectValue(option, value, all)
                : deselectValue(option, value);

              this.$emit('change', changeValue);
            }
          },
          attrs: {
            type: 'checkbox',
            id: id + '_' + index,
            checked: this.isChecked(option),
            disabled: this.isDisabled(option),
            autofocus: autofocus && index === 0
          }
        }),
        h('span', {}, [option.label])
      ]);

    return h('div', { attrs: { id } }, [
      ...this.schema.enum.map((option, index) => {

        const checkbox = [makeCheckbox({ option, index })];
        const attrs = inline
          ? { class: `checkbox-inline` }
          : { class: `checkbox` };

        return inline
          ? h('label', { key: index, attrs }, checkbox)
          : h('div', { key: index, attrs }, [h('label', {}, checkbox)]);
      })
    ]);
  }
};
</script>
