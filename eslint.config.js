import js from '@eslint/js';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import htmlPlugin from 'eslint-plugin-html';

const baseRules = {
  'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  eqeqeq: ['error', 'always'],
  curly: ['error', 'multi-line'],
  'no-var': 'error',
  'prefer-const': 'error',
  'no-throw-literal': 'error',
  'no-duplicate-imports': 'error',
};

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.js', '**/*.html'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
        document: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
        location: 'readonly',
        history: 'readonly',
        URL: 'readonly',
        MutationObserver: 'readonly',
        IntersectionObserver: 'readonly',
        speechSynthesis: 'readonly',
        SpeechSynthesisUtterance: 'readonly',
        Howl: 'readonly',
        confetti: 'readonly',
      },
    },
    plugins: { html: htmlPlugin },
    rules: baseRules,
  },
  {
    files: ['**/__tests__/**/*.js'],
    languageOptions: {
      globals: { ...globals.jest },
    },
    rules: { ...baseRules, 'no-console': 'off' },
  },
  {
    ignores: [
      'node_modules/**',
      '.husky/**',
      'servidor Urukais/**',
      '*.mp4',
      '*.jpeg',
      '*.png',
      '*.svg',
      'package-lock.json',
    ],
  },
];
