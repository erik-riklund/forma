<img src="https://raw.githubusercontent.com/erik-riklund/forma/b015d3d77f3c1c110b0ac12df2e036106866ccd9/logo.svg" width="64" height="64">

# Forma Compile

![Version](https://img.shields.io/npm/v/forma-compile?style=flat-square)
![Bundle size](https://img.shields.io/badge/bundle-~3.28kB-green?style=flat-square&labelColor=222&color=44cc88)
![License](https://img.shields.io/npm/l/forma-compile?style=flat-square)

### Tiny compiler. Maximum power. ⚡

The **Forma compiler** is a declarative, component-based template compiler designed to streamline server-side rendering. With its clean and minimal syntax, Forma transforms templates into secure and isolated render functions, enabling the creation of fast, lightweight, and scalable web applications.

> While the compiler is primarily designed for web development, its versatility allows it to be adapted for other use cases as well.

The compiler delivers a robust feature set with a minimal footprint, making it an excellent fit for modern server-rendered web development. Its focus on server-side rendering ensures simplicity and performance, making it ideal for scenarios where client-side interactivity isn’t required.

> Use complementary tools like [Alpine.js](https://alpinejs.dev/) for client-side interactivity.

[Explore usage examples](https://github.com/erik-riklund/forma/blob/main/packages/compiler/docs/EXAMPLES.md) or continue reading to learn more about how Forma can enhance your project. 🚀

---

## 🔦 Highlights

- 📦 **Tiny** — `3.28kB` runtime with no dependencies
- 🔒 **Secure by design** — no runtime code evaluation
- 🧠 **Optimized** — carefully designed to maximize utility without redundancy
- 🧼 **Isolated** — templates compile into self-contained render functions
- 💡 **Predictable** — declarative templates with no runtime surprises
- 🧩 **Component-driven** — scoped properties, block content, and named slots
- ⚙️ **Composable** — build UIs by combining reusable components

---
## 📦 Installation

To install Forma Compile, use your preferred `npm`-compatible package manager:

```bash
npm install forma-compile
```

> The manager preferred by Forma is [Bun](https://bun.sh/).

---

## ⚙️ Using the Compiler

After installing Forma Compile, you can start using its compiler by importing it into your project:

```js
import { compile } from 'forma-compile';
```

The `compile` API provides two key methods: `toFunction` and `toString`.

### `toFunction`

This method compiles a template into a reusable render function:

```js
const template = 'Hello {{ name }}!';
const renderFunction = compile.toFunction(template);

// Execute the render function with a data context
const output = renderFunction({ name: 'World' });
console.log(output); // Output: Hello World!
```

### `toString`

This method compiles a template into a string representation of the render function, which can be cached or reused:

```js
const template = 'Hello {{ name }}!';
const compiledFunction = compile.toString(template);

console.log(compiledFunction);
// Output: A string representation of the render function
```

### When to use each method

- **`toFunction`**: Use this for immediate execution of templates with a data context.
- **`toString`**: Use this for scenarios where you need to store or transmit the compiled function, such as caching or server-side precompilation.

---

## 📖 Learning the syntax

Forma templates use a concise, declarative syntax designed for simplicity and developer experience. The syntax is intentionally minimalistic, allowing you to focus on the structure and logic of your templates without unnecessary complexity.

### Key Syntax Features

1. **Declarative** — Forma templates emphasize a declarative approach, where you describe what the UI should look like rather than how to construct it. This makes the templates easier to read and maintain.

2. **Minimal boilerplate** — With Forma, you can achieve more with less code. The syntax avoids unnecessary verbosity, enabling you to write clean and efficient templates.

3. **Safe and predictable** — Built-in safeguards like HTML encoding for variables ensure that your templates are secure by default, reducing the risk of common vulnerabilities such as cross-site scripting (XSS).

4. **Component-centric** — The syntax is optimized for building reusable components, making it easy to create modular and maintainable UIs.

5. **Flexible modifiers** — Forma provides powerful modifiers like `!` for raw content and `:` for locally scoped variables, giving you fine-grained control over your templates.

6. **Built-in control flow** — With native support for conditionals, loops, and slots, Forma templates can handle complex rendering logic without relying on external libraries or frameworks.

By combining these features, Forma templates strike a balance between simplicity and power, making them an excellent choice for developers looking to build scalable and maintainable server-side rendered applications.

---

### 🧠 Variables

Forma templates support variable interpolation with optional default values. By default, these variables point to the provided data context. You can use the `:` modifier to access variables from the current scope. This is especially useful inside lists or when passing properties between components.

```html
<!-- data context -->
Hello {{ name }}

<!-- data context with default value -->
Hello {{ user.name -> Guest }} 

<!-- local variable -->
Hello {{: name }}
```

Variables are **HTML-encoded** for safety. You can disable this by using the `!` modifier:

```html
{{! content }}
```

> *You can combine `!` and `:` as long as the exclamation mark comes first.*

---

### 🧩 Components

Components are isolated templates that receive **properties** and **block content**:

```html
<!-- component without block content -->
<component button label="Click me"></component>

<!-- self-closing component without block content -->
<component button label="Click me" />

<!-- component with block content -->
<component button>Click me</component>
```

#### Implicit property names

Forma allows you to define properties implicitly using the `~` prefix. This is useful for scenarios where the property name matches the variable name, reducing redundancy in your templates.

```html
<component user name="{ name }">Hello world</component>
```

The above example explicitly sets the `name` property to the value of the `name` variable. With implicit property names, you can simplify this:

```html
<component user ~name>Hello world</component>
```

Here, the `~name` shorthand automatically assigns the value of the `name` variable to the `name` property. This makes your templates cleaner and easier to read, especially when dealing with multiple properties.

> If there is both a local variable `name` and a context variable, the local variable takes precedence.

#### Passing dynamic property values

You can pass variable values using `{...}` (single braces), and the `:` modifier can be used for local variables. These variables are **never** HTML-encoded; they are passed as raw values.

```html
<component card title="{ user.name }"></component>
```

#### Using properties and rendering block content

Inside the component template, use `{{ label }}` or `{{@ children }}` to reference properties or the provided block content:

```html
<!-- button component -->
<button>{{ label }}</button>

<!-- layout component -->
<header>Header</header>
<main>{{@ children}}</main>
<footer>Footer</footer>
```

---

### 🔌 Named slots

You can define **named slot content** using `<render slot="name">` and consume it using `<slot name>` in a component:

```html
<!-- template -->
<component layout>
  <render slot="title">
    <h1>My Page</h1>
  </render>
  <p>Welcome to Forma!</p>
</component>
```

```html
<!-- layout component -->
<header>
  <slot title>No title available</slot>
</header>
<main>{{@ children }}</main>
```

If a slot isn't rendered, the fallback content inside `<slot>` will be used instead.

---

### 🔁 Rendering lists

Forma includes built-in iteration via `<list>` and `<reverse-list>`:

```html
<list users as="user">
  <li>{{: user.name }}</li>
</list>

<reverse-list items as="item">
  <p>{{: item }}</p>
</reverse-list>
```

All items are automatically scoped as the variable you define (e.g. `user`, `item`).

---

### 🔀 Conditional rendering

Forma supports inline control flow with `<if>`, `<else-if>`, and `<else>`:

```html
<if condition="loggedIn">Welcome back!</if>
<if not condition="loggedIn">Please log in.</if>

<if condition="a">
  A is true
<else-if condition="b">
  B is true
<else>
  Neither is true...
</if>
```

Conditions default to `self.variableName`, but you can use local scoping with `:`:

```html
<if condition=": someLocalVariable">...</if>
```

### 💡 Examples

[Explore practical examples and usage instructions](https://github.com/erik-riklund/forma/blob/main/packages/compiler/docs/EXAMPLES.md) to get started.

---

## 🚧 Roadmap

- ✔️ Components with block content
- ✔️ Named slots with default content
- ✔️ List rendering (including reverse mode)
- ✔️ Variables with default values and safe lookups
- ✔️ HTML-encoded variables to avoid script injections (with a modifier to allow raw content)
- ✔️ Simple conditional rendering
- ✔️ Self-closing element for components without block content
- ✔️ Switch-like conditional rendering

---

## 🧐 How it works

The compiler takes your template code and transforms it into JavaScript render functions. These functions generate HTML strings directly — no virtual DOM, no runtime template parsing. This approach ensures minimal overhead and maximum performance, making Forma an excellent choice for server-side rendering.

### A very basic template

Let's assume that we have the following template:

```html
Hello world
```

After being compiled, it's transformed to a render function that is safe to cache and reuse in any server-rendered context.

```js
(self, parent) => {
  self = self || {};
  parent = parent || {};
  self.__slots = [];

  var v = (t) => typeof t === 'function' ? t() : t;
  var e = (t) => typeof t === 'string' && t.replaceAll('<','&lt;').replaceAll('>','&gt;') || t;
  var r = (t) => t !== false && t !== null && t !== undefined;
  var c = (a,b) => typeof a=== 'number' ? a === parseInt(b) : a === b;
  
  if (self.__children) {
    self.__children_r = self.__children();
  }
  return `Hello world`;
};
```

The helper functions (`v`, `e`, `r`, and `c`) are injected into every compiled template:
- `v`: safely resolves function values
- `e`: encodes HTML
- `r`: evaluates truthiness
- `c`: compares switch values

They are always present as each template works in complete isolation.

---

## 🚀 Stress test results

All tests were conducted using the [Bun](https://bun.sh/) runtime for optimal performance benchmarking.

- 🧪 Compiled and rendered 1,000 components in under 100ms
- 🧪 Compiled 1,003 components and executed 3,001 total renders in ~200ms.

---

## ❤️ License: MIT

Copyright 2025 Erik Riklund (Gopher)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
