# Portfolio Tech Stack

This document outlines the technologies used in this portfolio project and provides a brief description of where they are implemented.

## Core Setup
- **React (v18)**: Core UI library used across the entire application.
- **Vite**: Ultra-fast build tool and development server.
- **TypeScript**: Used throughout the codebase (`.tsx`, `.ts`) for type safety and better developer experience.

## Styling & Layout
- **Tailwind CSS**: Utility-first CSS framework used for styling components directly via `className` props.
- **Class Variance Authority (CVA) & `clsx` / `tailwind-merge`**: Used to construct and merge Tailwind classes conditionally, especially in UI components.
- **Lucide React**: Provides beautiful, consistent icons used across the site (headers, footers, buttons).

## UI Components & Design System
- **Shadcn UI & Radix UI**: Accessible, unstyled React components. Used extensively for complex UI elements like Dialogs, Popovers, Accordions, Tabs, Tooltips, and Dropdown Menus.
- **next-themes**: Handles dark mode and light mode theme switching.
- **Framer Motion**: Powers smooth animations and page transitions (e.g., used heavily in the `BeyondWork.tsx` page to stagger loading components).
- **Embla Carousel**: Used for swipeable carousels.

## Routing & State Management
- **React Router DOM**: Handles navigation between different pages (`/`, `/beyond-work`, etc.).
- **TanStack React Query**: Used for asynchronous state management and data fetching.

## Forms & Validation
- **React Hook Form**: Manages complex form state and validation effortlessly.
- **Zod**: Used for schema-based form validation to ensure data integrity.

## Data Visualization & Markdown
- **Recharts**: For rendering interactive charts and graphs if any are used in the dashboard or project showcases.
- **React Markdown**: Used to safely parse and render markdown content (e.g., Blog posts).

## Utilities
- **date-fns & react-day-picker**: For handling dates and providing calendar UI components.
- **Sonner**: Used for elegant toast notifications.
- **Vercel Analytics**: Provides usage statistics once deployed on Vercel.

## Testing & Quality
- **Vitest & React Testing Library**: Setup for running unit and component tests.
- **ESLint**: Linter to maintain code quality.
