# Stylelint Configuration Usage

This package provides a shared Stylelint configuration for SCSS/CSS linting in HubSpot Marketing WebTeam projects.

## Installation

1. Install the package and stylelint dependencies:

```bash
npm install --save-dev @hs-web-team/eslint-config-node stylelint stylelint-config-standard-scss
```

## Usage

Create a `.stylelintrc.json` file in your project root:

```json
{
  "extends": "@hs-web-team/eslint-config-node/.stylelintrc.json"
}
```

Alternatively, create a `.stylelintrc.js` file:

```javascript
module.exports = {
  extends: '@hs-web-team/eslint-config-node/.stylelintrc.json',
  // Add your custom rules here
  rules: {
    // Custom overrides
  },
};
```

## Add Scripts to package.json

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "stylelint:check": "stylelint '**/*.{css,scss}'",
    "stylelint:fix": "stylelint '**/*.{css,scss}' --fix"
  }
}
```

Then run:

- `npm run stylelint:check` - Check for style issues
- `npm run stylelint:fix` - Automatically fix style issues

## What's Included

The configuration extends `stylelint-config-standard-scss` with custom rules for HubSpot projects:

### Base Configuration
- **Extends**: `stylelint-config-standard-scss` (Standard SCSS linting rules)

### Disabled Rules
The following rules are disabled to allow more flexibility in HubSpot projects:

- **length-zero-no-unit**: Allows units on zero values (e.g., `0px`)
- **declaration-empty-line-before**: No empty line requirement before declarations
- **no-empty-source**: Allows empty source files
- **selector-class-pattern**: No pattern enforcement for class names
- **declaration-block-no-redundant-longhand-properties**: Allows longhand properties
- **shorthand-property-no-redundant-values**: Allows redundant shorthand values
- **no-duplicate-selectors**: Allows duplicate selectors
- **font-family-name-quotes**: No quote requirement for font family names

### SCSS-Specific Rules
The following SCSS rules are customized:

- **at-rule-no-unknown**: Configured to ignore SCSS directives (`@function`, `@if`, `@else`, `@for`, `@each`, `@include`, `@mixin`, `@extend`)
- **scss/dollar-variable-pattern**: No pattern enforcement for variable names
- **scss/at-import-no-partial-leading-underscore**: Allows leading underscores in imports
- **scss/at-import-partial-extension**: Allows file extensions in imports
- **scss/percent-placeholder-pattern**: No pattern enforcement for placeholders
- **scss/at-mixin-argumentless-call-parentheses**: Flexible parentheses for mixins
- **scss/dollar-variable-empty-line-before**: No empty line requirement before variables
- **scss/double-slash-comment-whitespace-inside**: Flexible comment whitespace

### Custom Rules

- **alpha-value-notation**: No specific alpha value notation required
- **color-function-notation**: Flexible color function notation
- **media-feature-range-notation**: Set to `"context"` with warning severity
- **value-keyword-case**: Enforces lowercase keywords with camelCase for SVG keywords

## File Patterns

By default, Stylelint will process:
- `**/*.css`
- `**/*.scss`

## Ignore Files

Create a `.stylelintignore` file to exclude files from linting:

```
node_modules/
dist/
build/
*.min.css
```

## Integration with CI/CD

Add stylelint checks to your CI pipeline:

```yaml
# Example GitHub Actions
- name: Run Stylelint
  run: npm run stylelint:check
```

## Customizing Rules

To override rules for your project, add them to your `.stylelintrc.json`:

```json
{
  "extends": "@hs-web-team/eslint-config-node/.stylelintrc.json",
  "rules": {
    "selector-class-pattern": "^[a-z][a-zA-Z0-9]+$",
    "max-nesting-depth": 3
  }
}
```

## Troubleshooting

### Module Not Found Error

If you get a module not found error, ensure you have installed all dependencies:

```bash
npm install --save-dev stylelint stylelint-config-standard-scss
```

### Conflicts with Prettier

If using Prettier for CSS/SCSS formatting, ensure Stylelint focuses on code quality rules rather than formatting. The shared configuration already disables many formatting-related rules.
