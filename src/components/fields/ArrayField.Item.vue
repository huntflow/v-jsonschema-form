<template>
    <default-array-item
        class="array-item"
        :index="index"
        :has-move-up="has.moveUp"
        :has-move-down="has.moveDown"
        :has-remove="has.remove"
        :has-toolbar="has.toolbar"
        :disabled="disabled"
        :on-add-index-click="onAddIndexClick"
        :on-drop-index-click="onDropIndexClick"
        :on-reorder-click="onReorderClick"
        :readonly="readonly"
    >
        <component
            :is="registry.fields.SchemaField"
            :schema="itemSchema"
            :ui-schema="itemUiSchema"
            :form-data="itemData"
            :error-schema="itemErrorSchema"
            :id-schema="itemIdSchema"
            :required="isRequired"
            :on-change="onChangeForIndex(index)"
            :on-blur="onBlur"
            :on-focus="onFocus"
            :registry="registry"
            :disabled="disabled"
            :readonly="readonly"
            :autofocus="autofocus"
            :raw-errors="rawErrors"
        />
    </default-array-item>
</template>

<script>
    import DefaultArrayItem from './ArrayField.DefaultArrayItem';

    const PROPS = {
        index: Number,
        canRemove: { default: true, },
        canMoveUp: { default: true, },
        canMoveDown: { default: true, },
        itemSchema: Object,
        itemData: {},
        itemUiSchema: Object,
        itemIdSchema: Object,
        itemErrorSchema: Object,
        rawErrors: { type: Array, },
        uiSchema: { type: Object, },
        registry: { type: Object, required: true, },
        autofocus: { type: Boolean, default: false, },
        disabled: { type: Boolean, default: false, },
        readonly: { type: Boolean, default: false, },
        onBlur: Function,
        onFocus: Function,
        onAddIndexClick: Function,
        onDropIndexClick: Function,
        onReorderClick: Function,
        onChangeForIndex: Function,
    };


    export default {
        components: {
            'default-array-item': DefaultArrayItem,
        },
        props: PROPS,
        computed: {
            isRequired() {
                if (Array.isArray(this.itemSchema.type)) {
                    // While we don't yet support composite/nullable jsonschema types, it's
                    // future-proof to check for requirement against these.
                    return this.itemSchema.type.includes('null') === false;
                }
                // All non-null array item types are inherently required by design
                return this.itemSchema.type !== 'null';
            },
            has() {
                const { orderable, removable, } = {
                    orderable: true,
                    removable: true,
                    ...(this.uiSchema || {})['ui:options'],
                };
                const result = {
                    moveUp: orderable && this.canMoveUp,
                    moveDown: orderable && this.canMoveDown,
                    remove: removable && this.canRemove,
                };
                result.toolbar = Object
                    .keys(result)
                    .some(key => result[key]);

                return result;
            },
        },
    };
</script>
