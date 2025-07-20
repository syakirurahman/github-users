# Testing Setup

This project uses Vitest, React Testing Library, and Jest DOM for testing.

## Test Structure

- **Unit Tests**: Located in `src/components/[componentName].test.tsx`
- **Integration Tests**: Located in `src/App.test.tsx`
- **Test Setup**: Located in `src/test/setup.ts`

## Available Test Commands

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI (if vitest UI is installed)
pnpm test:ui
```

## Test Files

### Component Tests

1. **Button Component** (`src/components/button.test.tsx`)
   - Tests different variants (default, destructive, outline, secondary, ghost, link)
   - Tests different sizes (default, sm, lg, icon)
   - Tests click events and disabled state
   - Tests asChild prop functionality

2. **Input Component** (`src/components/input.test.tsx`)
   - Tests different input types
   - Tests value changes and event handling
   - Tests disabled state and custom className
   - Tests prop forwarding

3. **Accordion Component** (`src/components/accordion.test.tsx`)
   - Tests accordion rendering with multiple items
   - Tests trigger functionality
   - Tests custom className application
   - Tests chevron icon presence

### Integration Tests

**App Component** (`src/App.test.tsx`)
- Tests complete user search workflow
- Tests repository loading functionality
- Tests loading states and error handling
- Tests keyboard interactions (Enter key)
- Tests empty state handling

## Testing Utilities

- **Vitest**: Test runner with Jest-like API
- **React Testing Library**: DOM testing utilities
- **Jest DOM**: Custom matchers for DOM elements
- **User Event**: Simulates user interactions
- **JSDOM**: DOM environment for Node.js

## Mocking

The integration tests mock the GitHub API services:
- `src/lib/services/users.ts` - User search functionality
- `src/lib/services/repositories.ts` - Repository fetching functionality

This ensures tests run quickly and don't depend on external APIs.

## Best Practices

1. **Test user behavior, not implementation details**
2. **Use semantic queries** (getByRole, getByText, etc.)
3. **Test accessibility** through proper ARIA attributes
4. **Mock external dependencies** for reliable tests
5. **Keep tests focused and straightforward** 