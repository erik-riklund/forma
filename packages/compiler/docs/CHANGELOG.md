# Changelog

## [0.2.0] - 2025-04-13
### Added
- **Component System**: Isolated templates with scoped properties and block content.
- **Named Slots**: Define reusable content areas in components with fallback support.
- **List Rendering**: Supports `<list>` and `<reverse-list>` for dynamic lists.
- **Conditional Rendering**: Inline conditionals with `<if>`, `<else-if>`, and `<else>`.
- **HTML Encoding**: Automatic encoding of variables for XSS prevention with a raw modifier (`!`).
- **Implicit Attribute Names**: Automatically map attributes to variables using the `~` modifier.
- **Switch-like Control Flow**: Added `<when>`, `<case>`, and `<default>` for switch-style conditionals.

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