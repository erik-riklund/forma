<img src="https://raw.githubusercontent.com/erik-riklund/forma/b015d3d77f3c1c110b0ac12df2e036106866ccd9/logo.svg" width="64" height="64">

# Forma Compile

![Version](https://img.shields.io/npm/v/forma-compile?style=flat-square)
![Bundle size](https://img.shields.io/badge/bundle-~3.5kB-green?style=flat-square&labelColor=222&color=44cc88)
![License](https://img.shields.io/npm/l/forma-compile?style=flat-square)

### One small compiler for devs, one giant leap for markup. 🚀

Okay okay, maybe not lunar levels of impact — but if you're looking to leave clunky template syntax behind, keep on reading. That’s where Forma comes in. 👋

---

## 🔦 Highlights

- 📦 **Tiny** — ~3.5kB runtime with no dependencies
- 🔒 **Secure by design** — no runtime code evaluation
- 🧠 **Optimized** — carefully designed to maximize utility without redundancy
- 🧼 **Isolated** — templates compile into self-contained render functions
- 💡 **Predictable** — declarative templates with no runtime surprises
- 🧩 **Component-driven** — scoped properties, block content, and named slots
- ⚙️ **Composable** — build UIs by combining reusable components

---

**Forma** is a declarative, component-based template compiler designed to streamline server-side rendering. With its clean and minimal syntax, Forma transforms templates into secure, self-contained render functions, enabling the creation of fast, lightweight, and scalable applications.

The compiler delivers a robust feature set with a minimal footprint, making it an excellent fit for modern server-rendered web development. Its focus on server-side rendering ensures simplicity and performance, making it ideal for scenarios where client-side interactivity isn’t required.

> Use complementary tools like [Alpine.js](https://alpinejs.dev/) to layer in lightweight, declarative interactivity while Forma handles secure, server-rendered HTML. This pairing enhances your UI where needed, without adding runtime complexity or compromising security.

---

## ⚡ Performance


> _Forma isn’t just fast under pressure — **it’s composed.**_ 🥁

*Performance tests will be added continuously to test resilience, speed, and scalability.*

- ✅ Compiled and rendered a simple component **1,000** times in ~**60ms**
- ✅ Rendered a **precompiled** component **100,000** times in ~**95ms**
- ✅ Compiled **1,003** components and executed **3,001** total renders in ~**100ms**
- ✅ Rendered a list with **100 items** using a precompiled component **1,000** times in ~**50ms**
- ✅ Compiled and rendered a component with **100 dependencies**, **100** times in ~**400ms**
- ✅ Rendered a deeply nested recursive component tree with **111,111 nodes** in ~**150ms**

### 🛠️ Simulated production tests

- ✅ Rendered a blog index with **100,000** posts in **~190ms**
- ✅ Rendered a full product grid with **100,000** items in **~250ms**

> ℹ️ All tests were conducted using the [Bun](https://bun.sh/) runtime.

---

## 📖 Getting started

### 📦 Installation

To install Forma Compile, use your preferred package manager:

```bash
npm install forma-compile
```

---

### ⚙️ Compiler API

After installing Forma, start by importing the compiler into your project:

```js
import { compile } from 'forma-compile';
```

The `compile` API offers two primary methods: `toFunction` and `toString`. These methods allow you to transform templates into executable render functions or reusable string representations.

---

The `toFunction` method compiles a template into an executable render function. This function can then be used to generate HTML dynamically based on a provided data context.

```js
const template = 'Hello {{ name }}!';
const renderFunction = compile.toFunction(template);

// Execute the render function with a data context
const output = renderFunction({ name: 'World' });
console.log(output); // Output: Hello World!
```

> ℹ️ This method is ideal for scenarios where you need to render templates on the fly.

---

The `toString` method compiles a template into a stringified render function. This is particularly useful for build pipelines, caching, or scenarios where you want to store the compiled function for later use — all without relying on `eval`.

```js
const template = 'Hello {{ name }}!';
const compiledFunction = compile.toString(template);

console.log(compiledFunction); // Output: A string representation of the render function
```

The stringified function can be saved to a file for later use, enabling efficient caching and reuse across multiple rendering contexts. Additionally, it can be provided as a precompiled dependency to other components, which is required to use [recursive components](#🔄-recursive-components).

> ℹ️ Precompiling components reduces runtime overhead and ensures consistent performance, especially in large-scale or complex projects.

---

#### 📋 Parameters

Both `toFunction` and `toString` share the same set of parameters:

- **`template: string`**<br>
  The template string to be compiled. It defines the structure and dynamic content of your component.

- **`dependencies: Record<string, string> = {}`**<br>
  An optional object containing templates that the main template depends on. These dependencies are injected during compilation to ensure that components are self-contained.

- **`options: { recursive?: boolean } = {}`**<br>
  An optional configuration object. The `recursive` flag allows the compiler to enable recursion, making it possible for a component to reference itself during rendering.

---

### ✨ Official template file extension

We encourage you to use the `.fml` extension — short for _Forma Markup Language_.  

We get it, the acronym might raise an eyebrow or two — but when composing templates is this smooth, you’ll be saying it for all the right reasons. 😄

---

### 📖 Learning the syntax

Forma uses a concise, declarative syntax designed for **simplicity**, **readability**, and an enhanced **developer experience**. The syntax is intentionally minimalistic, focusing on clarity and structure while avoiding unnecessary complexity.

By prioritizing a clean and intuitive design, it enables you to quickly grasp its concepts and build robust components with minimal effort. This approach ensures that your code remains maintainable and expressive, even as your projects grow in size and complexity.

---

#### 🧠 Rendering dynamic values

Forma supports variable interpolation with optional default values, allowing you to render dynamic values inside your components. By default, these variables reference the components data context, ensuring a seamless connection between your data and the rendered output.

```html
<!--
Compiles to `self.name`, which is the provided data context for top-level components,
or an object with provided properties for nested components. -->

Hello {{ name }}
```

To enhance flexibility, Forma introduces the `:` modifier, which enables access to variables from the current local scope. This feature is particularly useful in scenarios such as iterating over lists or passing properties between components. For example, within a `<list>` block, the `:` modifier ensures that each item in the list is scoped correctly, avoiding conflicts with the components properties.

```html
<!--
Refers to a locally scoped variable (e.g., within a list rendering context) -->

Hello {{: name }}
```

Additionally, you can define fallback values for variables using the `->` operator. This ensures that your components remain robust and functional even when certain data points are missing or undefined. The fallback value acts as a default, providing a seamless user experience by preventing errors or blank outputs in your rendered components.

```html
<!--
Compiles to `self.user?.name || "Guest"` -->

Hello {{ user.name -> "Guest" }}
```

There is also support for nested fallback values, allowing you to chain multiple defaults for complex data structures. This chaining mechanism ensures that your templates remain concise and expressive, even when dealing with deeply nested or hierarchical data. It eliminates the need for verbose checks and simplifies the process of rendering dynamic content with confidence.

```html
<!--
Compiles to `self.user?.profile?.name || self.user?.name || "Guest"` -->

Hello {{ user.profile.name -> user.name -> "Guest" }}
```

---

### 🔒 Secure by design

Variables are **HTML-encoded** for safety. This ensures that any potentially malicious content, such as `<script>` tags or other HTML elements, is rendered as plain text rather than being executed in the browser. This is a critical security measure to prevent [Cross-Site Scripting (XSS) attacks](https://owasp.org/www-community/attacks/xss/), where attackers inject malicious scripts into web pages viewed by other users.

You can disable this by using the `!` modifier, which tells the system to render the variable as raw HTML. However, use this feature cautiously and only when you are certain that the content is safe and does not contain any untrusted or user-generated input.

> ⚠️ Disabling HTML encoding without proper validation can expose your application to security vulnerabilities.

```html
<!--
Compiles to `self.content` (the provided data context)
-->
{{! content }}

<!--
Compiles to `content` (a local variable)
-->
{{!: content }}
```

> ℹ️ *You can combine `!` and `:` as long as the exclamation mark comes first.*

---

### 🧩 Components

Components are modular elements that encapsulate both structure and functionality. They support **properties**, which allow you to pass dynamic data into the component, enabling customization and reusability. Additionally, components can include **block content**, providing a way to define content within the component's structure. This flexibility makes it easy to create complex, hierarchical UIs while maintaining a clean and declarative syntax.

Components are designed to be self-contained, meaning they manage their own scope and do not interfere with other components. This isolation ensures predictable behavior and simplifies debugging. Furthermore, components can leverage [**named slots**](#🔌-named-slots) to define specific areas where custom content can be injected, offering even more control over layout and design.

```html
<!-- 'button' here refers to the component name, not an HTML tag -->

<!-- without block content -->
<component button label="Click me"></component>

<!-- self-closing (no block content) -->
<component button label="Click me" />

<!-- with block content -->
<component button>Click me</component>
```

---

#### Implicit property names

Forma allows you to define properties implicitly using the `~` prefix. This feature is particularly useful when the property name matches the variable name, as it eliminates the need for repetitive declarations, making your components cleaner and more concise.

```html
<!-- explicit property name -->
<component user age="{ age }">Hello world</component>

<!-- implicit property name -->
<component user ~age>Hello world</component>
```

> ℹ️ Local variables take precedence over context variables, ensuring predictable behavior.

---

#### Passing dynamic property values

Dynamic property values allow you to seamlessly bind data to your components, ensuring that they remain flexible and adaptable to different contexts. By using `{...}`, you can inject values directly from your data context or local variables.

```html
<component profile name="{ user.name }" age="{: age }" />
```

> ⚠️ Dynamic property values are passed as raw values. To ensure safety and prevent unintended behavior, validate or sanitize the data before passing it to the component.

---

#### Using properties and rendering block content

Components allow you to define properties and render block content seamlessly. Properties are passed as attributes, while block content is defined between the opening and closing tags of the component. Inside the component, you can reference properties using `{{ propertyName }}` and block content using `{{@ children }}`.

```html
<!-- button component -->
<button style="color: {{ color }}">{{@ children}}</button>
```
```html
<!-- layout component -->
<header>Header</header>
<main>
  <component button color="red">Click me</component>
</main>
<footer>Footer</footer>
```

> ℹ️ The provided block content can be rendered more than once.

---

### 🔌 Named slots

Slots allow you to define specific areas within a component where custom content can be injected. This feature provides flexibility and control over the layout and design of your components, enabling you to create reusable and adaptable layout components.

You can define **named slot content** using the `<render slot="name">` tag and consume it within a component using the `<slot name>` tag. This mechanism allows you to pass content from a parent component to a child component in a structured and predictable way.

```html
<!-- Parent: -->
<component layout>
  <render slot="title">
    <h1>My Page</h1>
  </render>
  <p>Welcome to Forma!</p>
</component>
```

```html
<!-- Layout component: -->
<header>
  <slot title>No title available</slot>
</header>
<main>{{@ children }}</main>
```

Slots without fallback content can use self-closing tags, simplifying the structure and improving readability. A self-closing slot tag indicates that the slot is optional and will only render content if it is provided by the parent.

```html
<header>
  <slot title />
</header>
<main>{{@ children }}</main>
```

> ℹ️ Combine named slots with block content to create highly customizable components.

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

---

### 🔀 Switch-like conditional rendering

Switch-like conditional rendering evaluates a value against multiple cases, much like a traditional switch statement. This helps keep your templates clean and efficient, as the compiler optimizes these constructs into minimal render functions.

```html
<when variable="status">
  <case is="loading">Loading...</case>
  <case is="error">Something went wrong.</case>
  <default>Unknown status</default>
</when>
```

By default, the specified variable points to `self.variableName`, which is the provided data context. Adding a `:` before the variable name points it to a local variable instead.

---

### 🔄 Recursive components

> ⚠️ Recursive components should be used with caution to avoid infinite loops or excessive nesting that could impact performance.

Forma supports recursive components, which enables a template to call itself — useful for trees or nested structures.

```html
<h1>{{ title }}</h1>
<ul>
  <list items as="item">
    <li>
      <component self title="{: item.title }" items="{: item.items }" />
    </li>
  </list>
</ul>
```

To enable recursion, set the `recursive` flag to `true` when compiling the component:

```js
// We assume that `folder` contains the template above!
const renderFunction = compile.toFunction(folder, {}, { recursive: true });

const result = renderFunction(
  {
    title: 'Top dawg',
    items: [
      { title: 'Underdog', items: [ /* ... */ ] },
      // … and additional nested items as needed.
    ]
  }
);
```

#### Recursive dependencies

To enable recursiveness in dependency components, they must be precompiled with the `recursive` flag set to `true`:

```js
const nodeComponent = compile.toString(nodeTemplate, {}, { recursive: true });
const treeComponent = compile.toFunction(treeTemplate, { node: nodeComponent });
```

---

## 🔧 Versatile applications

Forma's lightweight, server-first design, coupled with its exceptional performance, make it a viable tool for developers across a wide range of projects. These include, but not limited to:

- **Static site generation** 📄<br>
  Pre-render static HTML for blogs, documentation, or marketing sites, ensuring fast load times and SEO-friendly content. The declarative syntax simplifies the process of creating reusable components, making it easy to maintain and scale your static sites.

- **Dynamic PDF creation** 📑<br>
  Pair Forma with tools like [Puppeteer](https://pptr.dev/) or [Playwright](https://playwright.dev/) to generate server-rendered PDFs for invoices, reports, or other documents.

- **Email template rendering** 📧<br>
  Leverage the secure and predictable syntax to create dynamic, personalized email templates. With built-in safeguards like HTML encoding, you can confidently generate emails that are both visually appealing and free from common security risks.

- **Command-line utilities** 💻<br>
  Forma's minimal footprint makes it perfect for CLI tools that generate HTML or other text-based outputs. Whether you're building a static site generator, a documentation tool, or a custom report generator, its efficiency ensures fast and reliable results.

- **Server-side rendering for microservices** 🌐<br>
  Use Forma to build lightweight, server-rendered components for microservices. Its isolated and composable design allows you to create modular templates that can be easily integrated into larger systems.

- **Prototyping and rapid development** 🚀<br>
  The simplicity and ease of use make Forma an excellent choice for prototyping. Quickly iterate on designs and functionality without the overhead of a full framework, enabling faster feedback and development cycles.

---

## 🧐 How it works

The compiler takes your template code and transforms it into JavaScript render functions. These functions utilize [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) to generate HTML strings directly — no virtual DOM, no runtime template parsing. This approach ensures minimal overhead and maximum performance, making Forma an excellent choice for server-side rendering.

### A very basic template

Let's assume that we have the following template:

```html
Hello world
```

After being compiled, it's transformed to a render function that is safe to cache and reuse in any server-rendered context. 

> It's likely safe to use in browsers as well, but this isn't actively tested as it's outside the project's scope. 🔍

```js
// This is what Forma compiles your markup into:

(self, parent) => {
  self = self || {};
  parent = parent || {};
  self.__slots = [];

  const v = (t) => typeof t === 'function' ? t() : t;
  const e = (t) => typeof t === 'string' && t.replaceAll('<','&lt;').replaceAll('>','&gt;') || t;
  const r = (t) => t !== false && t !== null && t !== undefined;
  const c = (a,b) => typeof a=== 'number' ? a === parseInt(b) : a === b;
  
  if (self.__children) {
    self.__children_r = self.__children();
  }
  return `Hello world`;
};
```

The helper functions (`v`, `e`, `r`, and `c`) are injected into every compiled function:
- `v`: safely resolves function values
- `e`: encodes HTML
- `r`: evaluates truthiness
- `c`: compares switch values

They are always present, even when not used, as each render function is self-contained. These functions are pure, side-effect-free, and add no runtime security concerns or performance overhead.

---

## ❤️ License: MIT

Copyright 2025 Erik Riklund (Gopher)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
