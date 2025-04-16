import { compile } from '-';
import { it, expect } from 'bun:test';

/**
 * This test verifies the performance and correctness of compiling and rendering
 * a simple component 1,000 times. The component is defined with a static template
 * and no dynamic data. The test ensures that the rendered output matches the
 * expected HTML string for each iteration, confirming that the rendering process
 * is consistent and efficient.
 * 
 * Execution time: ~60ms
 */
it.skip('compiles and renders a simple component 1,000 times',
  () =>
  {
    let count = 1;
    let success = true;

    while (success && count++ <= 1000)
    {
      const template = '<component test />';
      const component = '<h1>Hello says component</h1>';

      const renderFunction = compile.toFunction(template, { test: component });
      success = (renderFunction() === '<h1>Hello says component</h1>');
    }

    expect(success).toBe(true);
  }
);

/**
 * This test evaluates the performance and correctness of rendering a precompiled
 * component 100,000 times. The component is defined with a static template that
 * includes a dynamic placeholder for a `count` value. The test ensures that the
 * rendered output matches the expected HTML string for each iteration, confirming
 * that the rendering process is both accurate and efficient under high repetition.
 * 
 * Execution time: ~95ms
 */
it.skip('renders a precompiled component 100,000 times',
  () =>
  {
    const template = '<component test ~count />';
    const component = '<h1>Hello says component #{{ count }}</h1>';
    const renderFunction = compile.toFunction(template, { test: component });

    let count = 1;
    let success = true;

    while (success && count++ <= 100000)
    {
      success = (renderFunction({ count }) ===
        `<h1>Hello says component #${ count }</h1>`);
    }

    expect(success).toBe(true);
  }
);

/**
 * This test evaluates the performance and correctness of compiling and rendering
 * a component with two dependencies 1,000 times. The component is defined with
 * a static template that includes two dynamic placeholders: one for a `name` value
 * and another for a `file` value. The test ensures that the rendered output matches
 * the expected HTML string for each iteration, confirming that the rendering process
 * is accurate and efficient when handling multiple dependencies.
 * 
 * Execution time: ~100ms
 */
it.skip('compiles and renders a component with two dependencies 1,000 times',
  () =>
  {
    let count = 1;
    let success = true;

    while (success && count++ <= 1000)
    {
      const dependencies = {
        user: '<h1>Hello {{ name }}</h1>',
        avatar: '<img src="{{ file }}">',
      };
      const template = '<component user ~name /><component avatar ~file />';
      const renderFunction = compile.toFunction(template, dependencies);

      success = (renderFunction({ name: 'John', file: 'test.png' })
        === '<h1>Hello John</h1><img src="test.png">');
    }

    expect(success).toBe(true);
  }
);

/**
 * This test evaluates the performance and correctness of rendering a list with
 * 100 items using a precompiled component 1,000 times. The component is defined
 * with a static template that includes a dynamic placeholder for an `items` array.
 * The test ensures that the rendered output matches the expected HTML string for
 * each iteration, confirming that the rendering process is accurate and efficient
 * when handling lists with multiple items.
 * 
 * Execution time: ~50ms
 */
it.skip('renders a list with 100 items using a precompiled component 1000 times',
  () =>
  {
    const template = '<component test ~items />';
    const component = '<ul><list items as="item"><li>{{: item }}</li></list></ul>';
    const renderFunction = compile.toFunction(template, { test: component });
    const items = Array.from({ length: 100 }, (_, i) => `hello world`);

    let count = 1;
    let success = true;

    while (success && count++ <= 1000)
    {
      success = renderFunction({ items }) ===
        `<ul>${ '<li>hello world</li>'.repeat(100) }</ul>`;
    }

    expect(success).toBe(true);
  }
);

/**
 * This test evaluates the performance and correctness of compiling and rendering
 * a component with 100 dependencies 100 times. Each dependency is a simple component
 * that renders a static template with a dynamic placeholder for a `name` value.
 * The test ensures that the rendered output matches the expected HTML string for
 * each iteration, confirming that the rendering process is accurate and efficient
 * when handling a large number of dependencies.
 * 
 * Execution time: ~400ms
 */
it.skip('compiles and renders a component and its 100 dependencies 100 times',
  () =>
  {
    let count = 1;
    let success = true;

    const dependencies = Object.fromEntries(
      Array.from({ length: 100 }, (_, i) => [`test${ i }`, `<h1>Hello {{ name }}</h1>`])
    );

    while (success && count++ <= 100)
    {
      const template = Array.from({ length: 100 }, (_, i) => `<component test${ i } ~name />`).join('');
      const renderFunction = compile.toFunction(template, dependencies);

      success = renderFunction({ name: 'John' }) ===
        Array.from({ length: 100 }, (_, i) => `<h1>Hello John</h1>`).join('');
    }

    expect(success).toBe(true);
  }
);

/**
 * This test evaluates the performance and correctness of rendering a deep tree
 * structure with 111,111 nodes using a recursive component. The tree is generated
 * dynamically with a specified depth and breadth, where each node contains a label
 * and a list of child nodes. The component is defined with a recursive template
 * that renders each node and its children.
 * 
 * The test ensures that the rendered output includes the expected labels for the root
 * node and the deepest node, confirming that the recursive rendering process is accurate
 * and efficient for large hierarchical structures.
 * 
 * Execution time: ~150ms
 */
it.skip('renders a deep tree (111,111 nodes) using a recursive component',
  () =>
  {
    const createNodes = (
      labelPrefix: string, depth = 3, breadth = 3, level = 1): any[] =>
    {
      if (depth === 0) return [];

      return Array.from({ length: breadth }, (_, i) =>
      {
        const label = `${ labelPrefix }.${ i + 1 }`;
        return {
          label: `Node ${ label }`,
          children: createNodes(label, depth - 1, breadth, level + 1)
        };
      });
    };

    const node = '<h3>{{ label }}</h3><ul><li><list children as="child">' +
      '<component self label="{:child.label}" children="{:child.children}"/></list></li></ul>';

    const renderFunction = compile.toFunction(node, undefined, { recursive: true });
    const result = renderFunction({ label: 'Node 1', children: createNodes('1', 5, 10) });

    expect(result).toContain('<h3>Node 1</h3>');
    expect(result).toContain('<h3>Node 1.10.10.10.10.10</h3>');
  }
);

/**
 * This test evaluates the performance and correctness of rendering a full blog
 * index page with 25,000 posts. The blog page is structured using a layout component
 * that includes a header slot for the title and a section for the list of posts.
 * 
 * Each post is rendered using a post component that displays the title, summary,
 * and author. The test ensures that the rendered output includes the expected
 * content for the first and last posts, as well as the main layout structure,
 * confirming that the rendering process is accurate and efficient for large datasets.
 * 
 * Execution time: ~190ms
 */
it.skip('renders a full blog index page with 100,000 posts',
  () =>
  {
    const layout = `
    <main>
      <header><slot title>No Title</slot></header>
      <section>{{@ children }}</section>
    </main>
  `;

    const post = `
    <article>
      <h2>{{ title }}</h2>
      <p>{{ summary }}</p>
      <footer>By {{ author }}</footer>
    </article>
  `;

    const template = `
    <component layout>
      <render slot="title">Blog</render>
      <list posts as="post">
        <component post title="{:post.title}" summary="{:post.summary}" author="{:post.author}" />
      </list>
    </component>
  `;

    const posts = Array.from({ length: 100_000 },
      (_, i) => ({
        title: `Post ${ i + 1 }`,
        summary: `Summary for post ${ i + 1 }`,
        author: `Author ${ i + 1 }`
      })
    );

    const renderFunction = compile.toFunction(template, { layout, post });
    const html = renderFunction({ posts });

    expect(html).toContain('<h2>Post 1</h2>');
    expect(html).toContain('<h2>Post 100000</h2>');
    expect(html).toContain('<main>');
  }
);

/**
 * ?
 */
it.skip('renders a product grid with 100,000 cards',
  () =>
  {
    const layout = `
    <section>
      <header><slot title>No title</slot></header>
      <div class="grid">{{@ children }}</div>
    </section>
  `;

    const productCard = `
    <article class="product">
      <h2>{{ name }}</h2>
      <p>{{ description }}</p>
      <p class="price">{{ price }}</p>

      <if condition="onSale"><span class="badge">On Sale</span></if>
      <if condition="outOfStock"><span class="badge danger">Out of stock</span></if>
    </article>
  `;

    const template = `
    <component layout>
      <render slot="title"><h1>All Products</h1></render>
      <list products as="product">
        <component productCard
          name="{:product.name}"
          description="{:product.description}"
          price="{:product.price}"
          onSale="{:product.onSale}"
          outOfStock="{:product.outOfStock}" />
      </list>
    </component>
  `;

    const products = Array.from({ length: 100_000 },
      (_, i) => ({
        name: `Product ${ i + 1 }`,
        description: `Description for product ${ i + 1 }`,
        price: `$${ (i + 1) * 1.1 }`,
        onSale: i % 10 === 0,
        outOfStock: i % 17 === 0
      })
    );

    const renderFunction = compile.toFunction(template, { layout, productCard });
    const result = renderFunction({ products });

    expect(result).toContain('Product 1');
    expect(result).toContain('On Sale');
    expect(result).toContain('Out of stock');
    expect(result).toContain('Product 10000');
  }
);
