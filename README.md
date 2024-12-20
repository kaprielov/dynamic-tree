# Dynamic tree

It is a React-based application that allows users to interactively manage and organize hierarchical data structures through an intuitive drag-and-drop interface. Users can rearrange tree nodes, insert nodes as children or siblings, and view detailed information about each node in a sidebar.

## Quick Start

Follow these steps to set up the project locally:

1. Install dependencies:
```
npm install
npm run dev
```

## Run test

```
npm test
```

## Info

Hold cmd button to put element inside

React StrictMode is enabled by default. This may cause repeated requests or effects in development mode. This is expected behavior and helps detect potential side effects in your code.

## Recommendations

The following improvements are suggested to enhance the project:

- **CSS Modules**:
Use CSS Modules to enable scoped and maintainable styles.
Add CSS variables

- **State Management**:
Integrate a state management library like **Redux** or **Zustand** to manage complex state logic.

- **Enhance Accessibility**:
Ensure the application is accessible to all users by:
**Keyboard Navigation**: Allow users to navigate and manipulate the tree using keyboard shortcuts.
**ARIA Attributes**: Implement appropriate ARIA roles and attributes to convey the tree structure to assistive technologies.
**Focus Management**: Manage focus states effectively during drag-and-drop operations.

- **Improve Performance**:
If more data becomes available, it is better to use `Map` rather than `while` to quickly traverse the tree.
For very large trees, implement virtualization to render only the visible portions of the tree, improving performance.
Use libraries like react-window or react-virtualized to handle virtualization.

## Known issues
- Bugs with drag and drop. Can't drag to the beginning and end
- Cover the rest of the components with tests
- ESlint is not strict enough