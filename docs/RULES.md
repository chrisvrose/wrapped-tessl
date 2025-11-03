# Agent Rules

This file is updated running `tessl registry install`. If a linked file is missing, make sure to run the command to download any missing tiles from the registry.

---

## Tech Stack

### React Router 7
- Use React Router 7 with file-based routing in `app/routes/`
- Route files must use the naming pattern: `routes/[route-name].tsx`
- Use `layout()` for layout routes and `route()` for regular routes in `app/routes.ts`
- Always check `app/routes.ts` to understand the routing structure before adding new routes

### Package Manager
- Use **npm** exclusively for package management
- Run `npm install` to install dependencies, not yarn or pnpm

### UI Components
- **NEVER import from `@radix-ui/*` packages directly**
- Always use the shadcn component wrappers from `app/components/ui/`
- Use lucide-react for icons, not other icon libraries
- Components are pre-configured with proper theming and styling

### Styling
- Use Tailwind CSS v4 utility classes for styling
- Use `tailwind-merge` via the `cn()` utility from `app/lib/utils.ts` to merge classes
- Follow the existing pattern of using `class-variance-authority` for component variants

### TypeScript
- All new files must be TypeScript (`.tsx` for components, `.ts` for utilities)
- Use proper type definitions, avoid `any` types
- Check existing component types for patterns

---

## Project Structure

### Component Organization
```
app/
├── components/
│   ├── ui/              # Shadcn UI components (DO NOT import radix-ui here)
│   ├── navigation/      # Navigation-specific components (sidebar, nav bars)
│   └── providers/       # Context providers (theme, query, etc.)
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── routes/              # Route components
```

### Adding New Components
- **UI Components**: Place in `app/components/ui/` if they're reusable UI primitives
- **Feature Components**: Place in `app/components/[feature-name]/` for feature-specific components
- **Route Components**: Place in `app/routes/` for page-level components

### Adding New Routes
1. Create the route component in `app/routes/[name].tsx`
2. Register it in `app/routes.ts` using the React Router 7 route config
3. If it needs a layout, nest it inside a `layout()` call
4. Use the `index()` function for index routes

---

## Code Patterns

### State Management
- Use **Zustand** for global state management
- Use **TanStack Query** (@tanstack/react-query) for server state and data fetching
- Use local component state (useState) for UI-only state

### Form Handling
- Use **react-hook-form** for form management
- Use **zod** for form validation schemas
- Use **@hookform/resolvers** to connect zod with react-hook-form

### Theme Support
- Theme is managed via **next-themes**
- Theme provider is in `app/components/providers/theme.provider.tsx`
- Support both light and dark modes in all components

### Providers Setup
- All providers are composed in `app/components/providers/app.provider.tsx`
- New providers should be added to this composition
- Order matters: outer providers wrap inner ones

### Animations
- Use **motion** (Framer Motion) for animations
- Use **rough-notation** for highlight/annotation effects

---

## Best Practices

### Component Style
- Use functional components with TypeScript
- Export components as named exports
- Add comments describing component functionality (not implementation changes)
- Keep components focused and single-responsibility

### File Naming
- Use kebab-case for file names: `my-component.tsx`
- Prefix provider files with their purpose: `theme.provider.tsx`
- Use descriptive names that indicate purpose

### Imports
- Group imports: React, third-party, local components, utilities, types
- Use absolute imports where helpful (configured via tsconfig paths)

### Code Quality
- Follow existing patterns in the codebase
- Keep solutions simple and avoid over-complication
- Check for implications of changes on other files
- Always consider the full scope of a change before implementing

---

## Documentation & Knowledge

### Before Starting Work
1. **Always** check `docs/KNOWLEDGE.md` for dependency documentation
2. Use the Tessl registry to search and install specs for new dependencies
3. Review linked documentation in KNOWLEDGE.md when using dependencies

### When Adding Dependencies
1. Check if there's a Tessl spec available: `tessl registry search [package-name]`
2. Install the spec: `tessl registry install tessl/npm-[package-name]`
3. Review the installed documentation before using the dependency

---

## Common Issues to Avoid

1. ❌ Importing from `@radix-ui/*` directly → ✅ Use shadcn components from `app/components/ui/`
2. ❌ Using yarn/pnpm → ✅ Use npm
3. ❌ Creating routes without updating `app/routes.ts` → ✅ Always register routes in the config
4. ❌ Mixing theme inconsistencies → ✅ Support both light/dark modes
5. ❌ Not checking KNOWLEDGE.md → ✅ Always review dependency docs first
6. ❌ Adding providers without composition → ✅ Add to `app.provider.tsx`