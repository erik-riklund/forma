<img src="https://raw.githubusercontent.com/erik-riklund/forma/b015d3d77f3c1c110b0ac12df2e036106866ccd9/logo.svg" width="64" height="64">

# Forma Load

### Flexible by default, customizable by design. 🧩

**Forma Load** is the official loader module for Forma templates. It provides a flexible and efficient way to manage and load templates in your applications. With its modular design, you can choose to use an existing adapter or create a new one specifically tailored to your project.

## 📦 Installation

> Note: This package is not released yet. 🚧

To install the loader, use your preferred `npm`-compatible package manager:

```bash
npm install forma-load
```

> The manager preferred by Forma is [Bun](https://bun.sh/).

## Usage

Import and use the loader, and the selected adapter, in your project:

```javascript
import { useLoader } from 'forma-load';
import { fileLoader } from 'forma-load/adapters/filesystem';

const loader = useLoader(fileLoader);
const template = await loader.fetchTemplate('path/to/template.fml');
```

## ❤️ License: MIT

Copyright 2025 Erik Riklund (Gopher)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
