<img src="https://raw.githubusercontent.com/erik-riklund/forma/b015d3d77f3c1c110b0ac12df2e036106866ccd9/logo.svg" width="64" height="64">

# Forma

### Build with structure, render with purpose. 🚀  
> _Please note that this project is a work in progress_ 😃

**Forma** is a declarative template compiler with a minimal footprint — and the foundation of a focused suite of tools for building server-rendered applications.

At its core, Forma transforms clean, HTML-like templates into pure JavaScript render functions with no runtime parsing or client-side dependencies. It's designed for developers who want to build applications using templates with **less logic** and **more intent**.

---

The Forma suite is designed to be modular and purpose-driven, with each tool focusing on a specific responsibility within the server-rendered workflow. This approach ensures that you can pick and choose the components you need, enabling a streamlined and efficient development process without unnecessary overhead.

| Package            | Description |
|--------------------|-------------|
| [`forma-compile`](https://github.com/erik-riklund/forma/tree/main/packages/compiler) | Transform templates into pure functions. |
| | <span style="font-size: 90%">_No dependencies._</span> |
| [`forma-load`](https://github.com/erik-riklund/forma/tree/main/packages/loader) | Load templates using adapters. |
| | <span style="font-size: 90%">_No dependencies._</span> |
| [`forma-transform`](https://github.com/erik-riklund/forma/tree/main/packages/transformer) | Transform raw templates into compiled render functions or strings. |
| | <span style="font-size: 90%">_Dependencies:_ `forma-compile`, `forma-load`</span> |
| [`forma-server`](https://github.com/erik-riklund/forma/tree/main/packages/server) | Used internally, not released as a package. |
| | <span style="font-size: 90%">_No dependencies._</span> |
| `forma-stack` | ? |
| | <span style="font-size: 90%">_Dependencies:_ `forma-transform`, `forma-server`</span> |