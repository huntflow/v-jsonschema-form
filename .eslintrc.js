module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:vue/recommended'
    ],
    rules: {
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always'],
        'quotes': ['error', 'single'],
        'vue/html-indent': ['error', 4, {
            'attribute': 1,
            'baseIndent': 1,
            'closeBracket': 0,
            'alignAttributesVertically': true,
            'ignores': []
        }],
        'vue/script-indent': ['error', 4, {
            'baseIndent': 1,
            'switchCase': 0,
            'ignores': []
        }],
        'vue/order-in-components': ['error', {
            'order': [
                'el',
                'name',
                'parent',
                'functional',
                ['delimiters', 'comments'],
                ['components', 'directives', 'filters'],
                'extends',
                'mixins',
                'inheritAttrs',
                'model',
                ['props', 'propsData'],
                'fetch',
                'asyncData',
                'data',
                'computed',
                'watch',
                'LIFECYCLE_HOOKS',
                'methods',
                'head',
                ['template', 'render'],
                'renderError'
            ]
        }],
        'vue/attributes-order': ['error', {
            'order': [
                'DEFINITION',
                'LIST_RENDERING',
                'CONDITIONALS',
                'RENDER_MODIFIERS',
                'GLOBAL',
                'UNIQUE',
                'TWO_WAY_BINDING',
                'OTHER_DIRECTIVES',
                'OTHER_ATTR',
                'EVENTS',
                'CONTENT'
            ]
        }]
    }
}
