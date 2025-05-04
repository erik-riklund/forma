# Changelog
This document provides a detailed changelog for the `forma-compile` package. It outlines the new features, changes, fixes, and security updates introduced in each version, starting from the initial release. Use this as a reference to track the evolution of the package and understand the impact of updates on your projects.

> ℹ️ Changes marked with ⚠️ are breaking changes that require template updates.

---

## `2.0.0`
### 2025-??-??

### 🆕 Added

- Added the `helpers` property to the API options, which specifies whether to include helper functions in the compiled output.
  > ℹ️ This option is used internally when compiling dependencies to minimize redundancy.

- Added support for specifying multiple fallback values for variable interpolation, allowing a chain of defaults to be used when a variable is undefined or null.
  ```html
  {{ :aLocalVariable -> aContextVariable -> "A string value" }}
  ```

- Added support for variable destructuring to `<list>` and `<reverse-list>`.
  ```html
  <list posts as="title, author, content">...</list>
  ```

- Added the `<empty>` tag to enable fallback rendering inside `<list>` blocks.
  ```html
  <list users as="user">
    <li>Name: {{: user.name }}</li>
    <empty>
      <li>No users available</li>
    </empty>
  </list>
  ```

- Added support for self-closing slots alongside the existing standard slots.
  ```html
  <slot mySlot />

  <slot mySlotWithFallbackContent>
    <!-- fallback content ... -->
  </slot>
  ```

- Added support for property-based implicit attribute names for components.
  ```html
  <component ~user.name />
  
  <!-- which is equivalent to -->
  <component name={{ user.name }} />
  ```

- ⚠️ Added the `&` modifier for passing objects by reference.<br>
  _All values are now stringified unless explicitly overridden._
  ```html
  <!-- `users` is an array in the data context -->
  <component userList users={{& users }}>...</component>

  <!-- when using implicit attribute names -->
  <component userList ~& users>...</component>
  ```

### 🔄 Changed

- ⚠️ String values for attributes are wrapped in double quotes, while variable values follow the same syntax as interpolation, e.g. `<if condition={{ someState }}>`.<br>
  _This change applies to all elements that accept variable attributes._

- ⚠️ Modified the syntax of the `<when>` tag. The `variable` attribute is renamed to `value-of`, and the variable that is being tested follow the same syntax as interpolation.
  ```html
  <when value-of={{ aContextVariable }}>
  ```

---

## `1.1.0`
### 2025-04-15

### 🆕 Added

- Added support for components to call themselves recursively during rendering.

- Added an `options` parameter for API methods, currently supporting the `recursive` flag which enables self-referencing components.

- Added comprehensive performance tests for various scenarios.

---

## `1.0.0`
### 2025-04-13

Initial release. 🎉