<img src="https://raw.githubusercontent.com/erik-riklund/forma/b015d3d77f3c1c110b0ac12df2e036106866ccd9/logo.svg" width="64" height="64">

# Forma Compile

## 🧪 Examples

This section demonstrates various use cases of the Forma compiler in real-world scenarios.

- [Using named slots](#using-named-slots)
- [Rendering an article list](#rendering-an-article-list)
- [Composing layouts and pages](#composing-layouts-and-pages)
- [Conditional user greeting](#conditional-user-greeting)
- [Card component with fallback properties](#card-component-with-fallback-properties)

---

### Using named slots

Named slots allow you to inject content into specific areas of a component.

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
const compiled = compile.toFunction(main, { layout });
compiled({ user: { name: 'Forma' } });
```

---

### Rendering an article list

Render a dynamic list of articles using a component and a data array.

```html
<!-- Main Template -->
<h1>Articles</h1>
<ul>
  <list articles as="article">
    <component article title="{: article.title }">
  </list>
</ul>
```

```html
<!-- Article Component -->
<li>{{ title }}</li>
```

```ts
const articles = [
  { title: 'Getting Started with Forma' },
  { title: 'Advanced Slots and Layouts' }
];

const html = compile.toFunction(template, { article })({ articles });
```

---

### Composing layouts and pages

Use a `layout` component to create reusable page structure.

```html
<!-- Page Template -->
<component layout>
  <render slot="title">
    <h1>{{ page.title }}</h1>
  </render>
  <p>{{ page.content }}</p>
</component>
```

```html
<!-- Layout Component -->
<article>
  <header>
    <slot title>Untitled</slot>
  </header>
  <section>{{@ children}}</section>
</article>
```

```ts
const page = {
  title: 'Forma: v1 released',
  content: 'We’re live on npm and ready to roll!'
};

const renderFunction = compile.toFunction(pageTemplate, { layout });
const html = renderFunction({ page });
```

---

### Conditional user greeting

Conditionally render content based on login state.

```html
<!-- Template -->
<if condition="user.loggedIn">
  <p>Welcome back, {{ user.name }}!</p>
<else>
  <p>Please log in to continue.</p>
</if>
```

```ts
const renderFunction = compile.toFunction(template);
const html = renderFunction({ user: { loggedIn: true, name: 'Erik' } });
```

---

### Card component with fallback properties

Use default values and implicit prop names to simplify templates.

```html
<!-- Template -->
<component card ~user></component>
```

```html
<!-- Card Component -->
<article>
  <h2>{{ name -> Anonymous }}</h2>
  <p>{{ bio -> No bio available. }}</p>
</article>
```

```ts
const renderFunction = compile.toFunction(template, { card });
const html = renderFunction({ user: { name: 'Sofie' } });
```

---

### 👈 [Return to the README](../README.md)