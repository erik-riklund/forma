<img src="https://github.com/erik-riklund/forma/blob/main/logo.svg" width="64" height="64">

### Tiny compiler. Maximum power.
> Please note that this project is in an early stage. Use with caution - there may be breaking changes ahead 😃

**Forma Compiler** is a ~2.5kB declarative, component-based template compiler.  
It enables you to create highly efficient, secure, and maintainable server-rendered applications with ease.

Forma combines a minimal footprint with a robust feature set, ensuring your applications are both **lightweight and efficient**—a crucial advantage in modern web development. Designed with a clear focus on server-side rendering, Forma avoids client-side interactivity, making it a perfect fit for scenarios where simplicity and performance are paramount. For client-side interactivity, consider pairing Forma with tools like [Alpine.js](https://alpinejs.dev/), which seamlessly complement its capabilities.

[Dive right into the usage examples](https://github.com/erik-riklund/forma/blob/main/packages/compiler/EXAMPLES.md) or keep reading to find out more about what Forma Compiler is, and what it can do for your project. 😎

---

## 🔦 Highlights

- 📦 **Tiny** — minimal footprint
- 🧼 **Pure** — every template compiles into an isolated render function
- 💡 **Declarative** — no runtime logic, no surprises
- ⚙️ **Composable** — build your UI with simple, nested components
- 🧩 **Component-oriented** — scoped props, block content, named slots
- 🔒 **Secure by design** — no `eval`, no dynamic execution inside templates
- 🚀 **Feature-rich** — everything you need, nothing you don’t

---

## ✨ Features

- ✅ Pure, compiled render functions
- ✅ Component syntax with scoped property passing and block content
- ✅ Named slots with fallback (default) content
- ✅ List rendering, including reversed iteration
- ✅ Safe variable interpolation with optional default values
- ✅ Conditional rendering of blocks

---

## 📦 Installation

```bash
npm install forma-compile
```

> You can use any npm-compatible package manager.

---

## 📖 Learning the syntax

Forma templates use a small set of clean, declarative syntax rules that compile into safe, fast rendering functions that output plain HTML.

### 🧠 Variables

Out of the box, Forma supports variable interpolation with optional default values. By default, these variables point to the provided data context.

```html
Hello {{ name }}
Hello {{ user.name -> Guest }}
```

Variables are **HTML-encoded** for safety. You can disable this by using the `!` modifier:

```html
{{! content }}
```

You can use the `:` modifier to access variables from the current scope without `self`. This is especially useful inside lists or when passing properties between components.

You can combine `!` and `:` as long as the exclamation mark comes first.

---

### 🧩 Components

Components are isolated templates that receive **properties** and **block content**:

```html
<component button label="Click me"></component>
```

You can pass **dynamic values** using `{ ... }` (single braces) and the `:` modifier can be used for local variables. These variables are **never** HTML-encoded; they are provided in their raw format.

```html
<component card title="{ user.name }"></component>
```

Inside the component template, use `{{ label }}` or `{{@ children }}` to reference properties or the default slot:

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

[Explore practical examples and usage instructions](https://github.com/erik-riklund/forma/blob/main/packages/compiler/EXAMPLES.md) to get started.

---

## 🚧 Roadmap

- ✔️ Components with block content
- ✔️ Named slots with default content
- ✔️ List rendering (including reverse mode)
- ✔️ Variables with default values and safe lookups
- ✔️ HTML-encoded variables to avoid script injections (with a modifier to allow raw content)
- ✔️ Simple conditional rendering
- ✔️ Self-closing element for components without block content
- 🚧 Switch-like conditional rendering

---

## 🧐 How it works

The compiler takes your template code and transforms it into JavaScript render functions. These functions directly output the final HTML, without relying on a virtual DOM or runtime template parsing. This approach ensures minimal overhead and maximum performance, making Forma an excellent choice for server-side rendering.

### A very basic template

Let's assume that we have the following template:

```html
<h1>Hello world</h1>
```

After being compiled, it's transformed to this:

```js
(self, parent) => {
  self = self || {};
  parent = parent || {};
  self.__slots = [];
  var v = (t) => (typeof t === 'function' ? t() : t);
  var e = (t) => t.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  var c = (t) => t !== false && t !== null && t !== undefined;
  if (self.__slots.length) {
    self.__children && self.__children();
  }
  return `<h1>Hello world</h1>`;
};
```

### An example using a component

Let's assume that we have these templates:

```js
const component = '<h1>News</h1>{{@ children}}';
const template = '<component test>Forma is taking shape!</component>';

const renderFunction = compile.toString(template, { test: component });
```

After being compiled, it's transformed to this:

```js
(self, parent) => {
  self = self || {};
  parent = parent || {};
  self.__slots = [];
  
  var v = (t) => (typeof t === 'function' ? t() : t);
  var e = (t) => t.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  var c = (t) => t !== false && t !== null && t !== undefined;

  var __test = (self, parent) => {
    self = self || {};
    parent = parent || {};
    self.__slots = [];
    
    var v = (t) => (typeof t === 'function' ? t() : t);
    var e = (t) => t.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    var c = (t) => t !== false && t !== null && t !== undefined;

    if (self.__slots.length) {
      self.__children && self.__children();
    }
    return `<h1>News</h1>${v(self.__children) || ''}`;
  };

  if (self.__slots.length) {
    self.__children && self.__children();
  }
  return `${__test({ __children: () => `Forma is taking shape!` }, self)}`;
};
```

When the function is executed, the resulting output is `<h1>News</h1>Forma is taking shape!`.

---

## ❤️ License: MIT

Copyright 2025 Erik Riklund (Gopher)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.