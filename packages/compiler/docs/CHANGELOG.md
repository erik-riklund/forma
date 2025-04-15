# Changelog

## [1.1.0] - 2025-04-15
### Added
- **Recursive components**: Support for components to call themselves recursively.
- **API options**: Introduced an `options` parameter for API methods, currently supporting the `recursive` flag to enable self-referencing components.
- **Performance tests**: Added comprehensive performance tests for various scenarios.

## [1.0.0] - 2025-04-13
### Added
- **Component system**: Isolated templates with scoped properties and block content.
- **Named slots**: Define reusable content areas in components with fallback support.
- **List rendering**: Supports `<list>` and `<reverse-list>` for dynamic lists.
- **Conditional rendering**: Inline conditionals with `<if>`, `<else-if>`, and `<else>`.
- **HTML encoding**: Automatic encoding of variables for XSS prevention with a raw modifier (`!`).
- **Implicit attribute names**: Automatically map attributes to variables using the `~` modifier.
- **Switch-like control flow**: Added `<when>`, `<case>`, and `<default>` for switch-style conditionals.

### Changed
- **API improvements**: Simplified usage and internal structure, enhancing performance.
- **Documentation**: Full syntax guide, installation instructions, and examples.

### Fixed
- Minor performance optimizations.
- **Self-closing components**: Proper handling of self-closing component elements (`<component />`).
- **Template parsing**: Various bug fixes for template parsing and edge cases.

### Security
- **Safe variable interpolation**: All variables are HTML-encoded by default, preventing XSS.
- **No eval**: No dynamic execution inside templates, ensuring a secure runtime.