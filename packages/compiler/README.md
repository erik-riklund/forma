# Forma

**Forma** is a ~2kB declarative, component-based JavaScript template compiler.  
It enables you to create highly efficient, secure, and maintainable server-rendered applications with ease.

Forma combines a minimal footprint with a robust feature set, ensuring your applications are both **lightweight and efficient**—a crucial advantage in modern web development. Designed with a clear focus on server-side rendering, Forma avoids client-side interactivity, making it a perfect fit for scenarios where simplicity and performance are paramount. For client-side interactivity, consider pairing Forma with tools like [Alpine.js](https://alpinejs.dev/), which seamlessly complement its capabilities.

---

## 🔦 Highlights

- 📦 **Tiny** — ~2kB minified and packed with features  
- 🧼 **Pure** — every template compiles into an isolated render function  
- 💡 **Declarative** — no runtime logic, no surprises  
- ⚙️ **Composable** — build your UI with simple, nested components  
- 🧩 **Component-oriented** — scoped props, children, slots  
- 🔒 **Secure by design** — no `eval`, no dynamic execution inside templates  
- 🚀 **Feature-rich** — everything you need, nothing you don’t  

---

## ✨ Features

- ✅ Pure, compiled render functions  
- ✅ Component syntax with scoped property passing  
- ✅ Named slots with fallback (default) content  
- ✅ Block content via `{{@ children}}`  
- ✅ List rendering (`<list ...>`) including reverse iteration  
- ✅ Safe variable interpolation with fallback (`{{ user.name -> Guest }}`)  

---

## 📦 Installation

Coming soon on npm:  
```bash
npm install forma-compile
```

> You can use any npm-compatible package manager.

---

## 🚧 Roadmap

- ✔️ Component system  
- ✔️ Named slots with fallback  
- ✔️ Block content  
- ✔️ List rendering (including reverse mode)
- ✔️ Default values and safe lookups  
- Simple conditional rendering

---

## 🧪 Examples

>This section is under construction. 🚧

### Using named slots

```html
<!-- main template -->
<component layout>
  <render slot="header"><h1>Welcome</h1></render>
  <p>Hello {{ user.name -> Guest }}</p>
</component>
```

```html
<!-- layout component -->
<header><slot header>No title</slot></header>
<main>{{@ children}}</main>
```

```ts
import { compile } from 'forma-compiler';
const html = compile.toFunction(template, { layout })({ user: { name: "Forma" } });
```

---

## ❤️ License: MIT

Copyright 2025 Erik Riklund (Gopher)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.