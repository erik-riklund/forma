## 🧪 Examples

This section demonstrates various use cases of the Forma compiler.

- [Using Named Slots](#using-named-slots)

---

### Using Named Slots

Named slots allow you to inject content into specific areas of a component.

**Example:**

```html
<!-- Main Template -->
<component layout>
  <render slot="header">
    <h1>Welcome</h1>
  </render>
  <p>Hello {{ user.name }}</p>
</component>
```

```html
<!-- Layout Component -->
<header>
  <slot header>No title</slot>
</header>
<main>{{@ children}}</main>
```

```ts
import { compile } from 'forma-compiler';

// Assuming `main` and `layout` contain the template strings:
const compiledFunction = compile.toFunction(main, { layout });
const renderedHtml = compiledFunction({ user: { name: 'Forma' } });
```

**Explanation:**

*   The `main` template uses the `layout` component.
*   The `<render slot="header">` tag injects the `<h1>Welcome</h1>` into the `header` slot of the `layout` component.
*   If the `header` slot is not filled, the `layout` component displays "No title" as a default.
*   `{{@ children}}` renders the content of the main template that is not inside a `render` tag.

---

> [Return to the README](README.md)