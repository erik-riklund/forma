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

**Forma** is a declarative, component-based template compiler designed for server-side rendering. With its clean and readable syntax, Forma transforms templates into secure, self-contained render functions, enabling the creation of fast and scalable server-focused applications.

> ℹ️ Use complementary tools like [Alpine.js](https://alpinejs.dev/) to layer in lightweight, declarative interactivity while Forma handles secure, server-rendered HTML. This pairing enhances your UI where needed, without adding runtime complexity or compromising security.

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

### ✨ Official file extension

You are encouraged to use the `.fml` extension — short for _Forma Markup Language_.  

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

> ⚠️ Disabling HTML encoding without proper validation can expose your application to security vulnerabilities.

Variables are **HTML-encoded** for safety. This ensures that any potentially malicious content, such as `<script>` tags or other HTML elements, is rendered as plain text rather than being executed in the browser. This is a critical security measure to prevent [Cross-Site Scripting (XSS) attacks](https://owasp.org/www-community/attacks/xss/), where attackers inject malicious scripts into web pages viewed by other users.

You can override this by using the `!` modifier, which tells the system to render the variable as raw HTML. However, use this feature cautiously and only when you are certain that the content is safe and does not contain any untrusted or user-generated input.

```html
<!--
Compiles to `self.content` (the provided data context) -->

{{! content }}

<!--
Compiles to `content` (a local variable) -->

{{!: content }}

<!--
 -->

{{:  }}
```

> ℹ️ *You can combine `!` and `:` as long as the exclamation mark comes first.*

---

### 🧩 Components

Components are modular elements that encapsulate both structure and functionality. They support **properties**, which allow you to pass dynamic data into the component, enabling customization and reusability. Additionally, components can include **block content**, providing a way to define content within the component's structure. This flexibility makes it easy to create complex, hierarchical UIs while maintaining a clean and declarative syntax.

```html
<!-- 'button' here refers to the component name, not an HTML tag -->

<!-- without block content -->
<component button label="Click me"></component>

<!-- self-closing (no block content) -->
<component button label="Click me" />

<!-- with block content -->
<component button>Click me</component>
```

Components are designed to be self-contained, meaning they manage their own scope and do not interfere with other components. This isolation ensures predictable behavior and simplifies debugging. Furthermore, components can leverage [**named slots**](#🔌-named-slots) to define specific areas where custom content can be injected, offering even more control over layout and design.

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

#### Passing non-string property values

?

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

The `<list>` and `<reverse-list>` tags allow you to iterate over arrays of data, rendering each item within the specified block. The `as` attribute defines the name of the variable that represents the current item in the iteration. This variable is scoped locally to the block, ensuring no conflicts with other variables in your template.

```html
<list users as="user">
  <li>{{: user.name }}</li>
</list>
```

`<reverse-list>` works the same as `<list>`, but iterates over the array in reverse order:

```html
<reverse-list users as="user">
  <p>{{: user.name }}</p>
</reverse-list>
```

You can nest `<list>` or `<reverse-list>` tags to iterate over nested arrays. Each nested block has its own scoped variable, ensuring clarity and avoiding conflicts.

```html
<list categories as="category">
  <h2>{{: category.name }}</h2>
  <list category.items as="item">
    <p>{{: item.name }}</p>
  </list>
</list>
```

Empty arrays can be handled using the `<empty>` tag within a `<list>` or `<reverse-list>` block:

```html
<list users as="user">
  <li>{{: user.name }}</li>
  <empty>
    <p>No users found.</p>
  </empty>
</list>
```

> ℹ️ The `<empty>` block must be placed at the end of the `<list>` block.

---

### 🔀 Conditional rendering

Inline control flow can be achieved with `<if>`, `<else-if>`, and `<else>` tags. These tags enable you to conditionally render content based on dynamic values. These tags provide a clean and declarative way to handle conditional logic directly within your components.

The `<if>` tag evaluates a variable and renders its content if the value is truthy:

```html
<!-- Checks if `self.loggedIn` is truthy -->

<if condition="loggedIn">Welcome back!</if>
```

To handle the opposite case, you can use the `not` modifier:

```html
<!-- Checks if the local variable `loggedIn` is truthy -->

<if not condition=":loggedIn">Please log in.</if>
```

For more complex scenarios, you can chain conditions using `<else-if>` and `<else>` tags. This allows you to handle multiple cases in a structured and readable manner:

```html
<if condition="a">
  A is true
<else-if condition="b">
  B is true
<else>
  Neither is true...
</if>
```

### Nesting conditions

You can nest `<if>` blocks to handle more intricate logic. Each nested block evaluates its condition independently, allowing for highly customizable rendering:

```html
<if condition="user">
  <p>Welcome, {{ user.name }}!</p>
  
  <if condition="user.isAdmin">
    <p>You have admin privileges.</p>
  </if>
<else>
  <p>Please log in to continue.</p>
</if>
```

---

### 🔀 Switch-like conditional rendering

Switch-like conditional rendering evaluates a value against multiple cases, much like a traditional switch statement. This helps keep your components clean and efficient, as the compiler optimizes these constructs into efficient code that evaluates conditions sequentially, ensuring fast and predictable performance.

The `<when>` tag is used to define the variable being evaluated, while `<case>` tags specify the conditions to match. A `<default>` tag can be included to handle cases where no match is found.

```html
<when variable="status">
  <case is="loading">Loading...</case>
  <case is="error">Something went wrong.</case>
  <default>Unknown status</default>
</when>
```

Switch-like rendering can be nested to handle more complex scenarios. Each nested `<when>` block evaluates its variable independently, allowing for highly customizable rendering.

```html
<when variable="user.role">
  <case is="admin">
    <p>Welcome, Admin!</p>

    <when variable="user.level">
      <case is="1">You have basic admin privileges.</case>
      <case is="2">You have advanced admin privileges.</case>
    </when>
  </case>
  <case is="user">Welcome, User!</case>
  <default>Please log in.</default>
</when>
```

The `<default>` tag is optional but recommended to handle cases where no `<case>` matches. If omitted, no content will be rendered for unmatched cases.

```html
<when variable="status">
  <case is="success">Operation successful!</case>
  <case is="error">Operation failed.</case>
  
  <!-- No default case -->
</when>
```

> ℹ️ Use `<when>` tags for scenarios with multiple discrete conditions to improve readability and maintainability.

---

### 🔄 Recursive components

> ⚠️ Recursive components should be used with caution to avoid infinite loops.

There is support for recursive components, which enables a template to call itself — useful for trees or nested structures. This feature is particularly beneficial when working with hierarchical data, such as file systems, organizational charts, or nested menus. Recursive components allow you to define a single template that can handle any level of nesting, simplifying your code and improving maintainability.

To use recursive components, ensure that the `recursive` flag is set to `true` during compilation. This flag enables the compiler to handle self-references within the template, ensuring that the component can call itself without causing errors.

Here's an example of a recursive component for rendering a tree structure:

```html
<component tree>
  <h1>{{ title }}</h1>
  <ul>
    <list items as="item">
      <li>
        <component self title="{{: item.title }}" items="{{: item.items }}" />
      </li>
    </list>
  </ul>
</component>
```

In this example, the `tree` component calls itself for each child node, passing the appropriate data for the next level of the hierarchy. This approach ensures that the component can handle any depth of nesting dynamically.

When designing recursive components, it's important to include a termination condition to prevent infinite loops. For example, you might check whether a node has children before rendering further nested components. This ensures that the recursion stops at the appropriate level, avoiding performance issues or stack overflows.

> ℹ️ Excessive nesting or deeply recursive structures can impact performance, so always test your templates with realistic data to ensure they perform as expected.

#### Recursive dependencies

Recursive dependency components must be precompiled with the `recursive` flag set to `true`:

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

### Example: Rendering a list with fallback content

To see how Forma works in practice, consider this template that displays a list of users. If the list is empty, it falls back to a default message:

```html
<ul>
  <list users as="user">
    <li>{{: user.name }}</li>
    <empty>
      <li>No content</li>
    </empty>
  </list>
</ul>
```

> ℹ️ The `<empty>` block must be placed at the end of the `<list>` block.

Forma compiles this into a render function that outputs a complete HTML string. The generated function is entirely static, side-effect-free, and safe to cache and reuse in any server-rendered context:

> While Forma's output can likely be used in browsers, this isn't a primary focus and is not actively tested. 🔍

```js
// This is what Forma compiles the markup into:

(self, parent) => {
  self = self || {};
  parent = parent || {};
  self.__slots = [];

  const v = (t) => typeof t === 'function' ? t() : t;
  const e = (t) => typeof t === 'string' && t.replaceAll('<', '&lt;').replaceAll('>', '&gt;') || t;
  const r = (t) => t !== false && t !== null && t !== undefined;
  const c = (a, b) => typeof a === 'number' ? a === parseInt(b) : a === b;

  if (self.__children) {
    self.__children_r = self.__children();
  }

  return `<ul>${
    (() => {
      let o = '';
      const l = v(self.users) || [];
      if (l.length) {
        for (const user of l) {
          o += `<li>${e(v(user?.name || ''))}</li>`;
        }
      } else {
        // The if statement is a hack to match the brace level :)
        if (true) {
          o = `<li>No content</li>`;
        }
      }
      return o;
    })()
  }</ul>`;
};
```

The compiler injects a set of lightweight utility functions into every top-level render function:

- `v`: resolves dynamic values safely (e.g., unwrapping functions)
- `e`: escapes HTML to prevent injection
- `r`: checks whether a value is "renderable" (truthy and defined)
- `c`: compares values in conditional or `switch` constructs

These helpers are always included to ensure that the render function is self-contained. They are pure, side-effect-free, and designed for performance and safety.

---

## ❤️ License: MIT

Copyright 2025 Erik Riklund (Gopher)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
