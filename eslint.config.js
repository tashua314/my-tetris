import js from '@eslint/js';
import globals from 'globals';
import svelte from 'eslint-plugin-svelte';

export default [
    {
        ignores: ['dist', 'node_modules'],
    },
    ...svelte.configs['flat/prettier'],
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            // Allow unused args if prefixed with _ for event handlers/hooks
            'no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
            ],
        },
    },
];
