<img src="https://raw.githubusercontent.com/erik-riklund/forma/b015d3d77f3c1c110b0ac12df2e036106866ccd9/logo.svg" width="64" height="64">

# Forma

### Build with structure, render with purpose. 🚀  
> _Please note that this project is a work in progress_ 😃

**Forma** is a ~3.5kB declarative template compiler — and the foundation of a focused suite of tools for building server-rendered applications.

At its core, Forma transforms clean, HTML-like templates into pure JavaScript render functions with no runtime parsing or client-side dependencies. It's designed for developers who want to build applications using templates with **less logic** and **more intent**.

---

## 🔧 Overview

The Forma suite is designed to be modular and purpose-driven, with each tool focusing on a specific responsibility within the server-rendered workflow. This approach ensures that you can pick and choose the components you need, enabling a streamlined and efficient development process without unnecessary overhead.

| Package            | Description |
|--------------------|-------------|
| [`forma-compile`](https://github.com/erik-riklund/forma/tree/main/packages/compiler) | Transform templates into pure functions. |
| | <span style="font-size: 90%">_No dependencies._</span> |
| [`forma-loader`](https://github.com/erik-riklund/forma/tree/main/packages/compiler) | Load templates using adapters (in progress). |
| | <span style="font-size: 90%">_No dependencies._</span> |
| `forma-transform` | Transform raw templates into compiled render functions or strings. |
| | <span style="font-size: 90%">_Dependencies:_ `forma-loader`</span> |
| `forma-server`     | Optional router/context layer for full SSR apps (planned). |
| | <span style="font-size: 90%">_Dependencies:_ `forma-compile`, `forma-transform`</span> |

---

## 💡 Explore

- `forma-compile`

  - [📦 npm](https://www.npmjs.com/package/forma-compile)<br>
    View the package on npm to see installation instructions, version history, and more.
  - [📊 Bundlephobia](https://bundlephobia.com/package/forma-compile)<br>
    Analyze the package size, download impact, and dependency details.

---

## ❤️ License: MIT

Copyright 2025 Erik Riklund (Gopher)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
