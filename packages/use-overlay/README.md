# @rara-kit/use-overlay

A lightweight and flexible overlay management library for React applications. This library provides an easy way to manage multiple overlays (modals, dialogs, popups, etc.) with both synchronous and asynchronous support.

## Overview

`@rara-kit/use-overlay` offers:

- 🎯 Simple API for managing overlays
- ⚡ Support for both synchronous and asynchronous overlays
- 🔄 Promise-based API for handling overlay results
- 🎨 Flexible rendering options
- 📦 Lightweight and zero dependencies (except React)

## Installation

```bash
npm install @rara-kit/use-overlay
# or
yarn add @rara-kit/use-overlay
# or
pnpm add @rara-kit/use-overlay
```

## Getting Started

### 1. Provider Setup

First, wrap your application with the `OverlayProvider`:

```tsx
import { OverlayProvider } from '@rara-kit/use-overlay';

function App() {
  return (
    <OverlayProvider>
      {/* Your app content */}
    </OverlayProvider>
  );
}
```

### 2. Basic Usage

Here's how to use a basic overlay:

```tsx
import { overlay } from '@rara-kit/use-overlay';

function MyComponent() {
  const handleOpenOverlay = () => {
    const close = overlay.open(({ isOpen, onRequestClose }) => (
      <Modal
        isOpen={isOpen}
        onClose={onRequestClose}
        title="Basic Overlay"
       />
    ));
  };

  return (
    <button onClick={handleOpenOverlay}>
      Open Overlay
    </button>
  );
}
```

### 3. Promise-based Usage

You can also use overlays with promises to get user input. The `resolve` function automatically closes the overlay:

```tsx
import { overlay } from '@rara-kit/use-overlay';

function MyComponent() {
  const handleOpenAsyncOverlay = async () => {
    try {
      const result = await overlay.openAsync<boolean>(({ isOpen, resolve }) => (
        <Modal
          isOpen={isOpen}
          onClose={() => resolve(false)}
          onSubmit={() => resolve(true)}
          title="Confirmation Required"
        />
      ));

      if (result) {
        // Handle confirmation
      }
    } catch (error) {
      // Handle rejection
    }
  };

  return (
    <button onClick={handleOpenAsyncOverlay}>
      Open Async Overlay
    </button>
  );
}
```

### 4. Utility Function Usage

You can create reusable overlay utilities:

```tsx
// toast.ts
export const showErrorToast = (message: string) => {
  overlay.open(({ isOpen, onRequestClose }) => (
    <div className="fixed top-20 right-20 bg-red-500 text-white p-4 rounded-md">
      <div>{message}</div>
      <button onClick={onRequestClose}>✕</button>
    </div>
  ));
};

// Usage anywhere in your app:
showErrorToast("Something went wrong!");
```

## Best Practices

### Create Reusable Overlay Utilities

Extract common overlay patterns into reusable utility functions:

```tsx
// utils/dialog.ts
export const confirm = (message: string) => {
  return overlay.openAsync<boolean>((props) => (
    <ConfirmDialog
      message={message}
      {...props}
    />
  ));
};

// utils/toast.ts
export const showToast = (message: string) => {
  overlay.open(({ onRequestClose }) => (
    <Toast message={message} onClose={onRequestClose} />
  ));
};

// Usage
const handleDelete = async () => {
  const confirmed = await confirm("Are you sure you want to delete?");
  if (confirmed) {
    try {
      await deleteItem();
      showToast("Successfully deleted");
    } catch {
      showToast("Error occurred while deleting");
    }
  }
};
```

## License

MIT

Source inspired by [Toss overlay-kit](https://github.com/toss/slash/tree/main/packages/react/use-overlay) (MIT License)
