
# 📝 Vynspire Blog Platform

A modern, full-stack blog platform built with **Next.js 15**, **Prisma**, and **Supabase**, featuring a rich text editor, authentication, and comprehensive CRUD operations.

---

## 🌐 Live Demo

Check out the deployed version on Vercel:  
🔗 [vynspire.vercel.app](https://vynspire.vercel.app/)

---

## ℹ️ Important Note

To ensure a smooth testing experience:

> **Please create a new user and new blog posts manually.**  
> The existing posts were generated via seed scripts and may not fully reflect the final UI or formatting logic. Manually created content will have correct styles and behavior.

## 🚀 Features

- 🔐 **JWT Authentication** with Zustand persistence and localStorage
- ✍️ **Full CRUD Operations** for blog posts with rich content
- 🧠 **Custom Hooks Architecture**:
  - `use-auth.hook.ts` – authentication state and route protection
  - `use-get-all-posts.ts`, `use-get-post.ts` – data fetching with React Query
  - `use-mobile.ts` – responsive design utilities
- 🗃️ **State Management** with Zustand for auth and global state
- 🎨 **Modern UI** with ShadCN UI components and Tailwind CSS v4
- 📝 **Advanced Rich Text Editor** with custom TipTap implementation
- 🧪 **Form Validation** using React Hook Form + Zod schemas
- 🌗 **Theme System** with dark/light mode support
- 🔍 **Advanced Search & Filtering** by title, content, category, and tags
- 📄 **Pagination** with customizable limits
- 📊 **Auto-calculated Read Time** based on content length
- 🖼️ **Image Support** with upload and resize capabilities
- ⚙️ **Development Tools**: Husky, Commitlint, and Biome for code quality

---

## 🧩 Tech Stack

### Core Framework
- **Framework**: Next.js 15.4.5 (App Router with Turbopack)
- **Runtime**: React 19.1.0
- **TypeScript**: Full type safety

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma 6.13.0 with migrations
- **API**: Next.js API Routes with route handlers
- **Auth**: JWT with bcrypt password hashing

### Frontend & UI
- **Styling**: Tailwind CSS v4 + ShadCN UI components
- **State Management**: Zustand with persistence
- **Data Fetching**: TanStack React Query (v5.84.1)
- **Forms**: React Hook Form + Zod validation
- **Theme**: next-themes with system preference support

### Rich Text Editor
- **Editor**: TipTap 3.0.9 with custom extensions
- **Features**: Code highlighting, image handling, typography
- **Extensions**: Custom bubble menus, link editing, horizontal rules

### Development Tools
- **Linting**: Biome (replaces ESLint/Prettier)
- **Git Hooks**: Husky with Commitlint
- **Package Manager**: pnpm with workspace support

---

## 📂 Project Structure

```
vynspire/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/               # Login page with schema & service
│   │   └── register/            # Registration page
│   ├── (session)/               # Protected routes
│   │   ├── _components/         # Session-specific components
│   │   │   └── posts/          # Post CRUD dialogs
│   │   ├── [post-id]/          # Dynamic post detail page
│   │   └── page.tsx            # Dashboard/home page
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   └── posts/              # Post CRUD endpoints
│   ├── globals.css             # Global styles
│   └── layout.tsx              # Root layout with providers
├── components/
│   ├── providers/              # React context providers
│   │   ├── query-provider.tsx  # TanStack Query setup
│   │   └── theme-provider.tsx  # Theme management
│   └── ui/                     # ShadCN UI components
│       ├── minimal-tiptap/     # Custom TipTap editor
│       │   ├── components/     # Editor UI components
│       │   ├── extensions/     # Custom TipTap extensions
│       │   ├── hooks/          # Editor-specific hooks
│       │   └── styles/         # Editor styling
│       └── [50+ UI components] # Complete ShadCN component library
├── hooks/
│   ├── auth/
│   │   └── use-auth.hook.ts    # Authentication logic & route protection
│   ├── posts/
│   │   ├── use-get-all-posts.ts # Posts fetching with React Query
│   │   └── use-get-post.ts     # Single post fetching
│   └── use-mobile.ts           # Responsive utilities
├── lib/
│   ├── prisma/                 # Prisma client setup
│   ├── auth.ts                 # JWT utilities
│   ├── axios.ts                # HTTP client configuration
│   └── utils.ts                # Utility functions
├── prisma/
│   ├── migrations/             # Database migrations
│   └── schema.prisma           # Database schema
├── scripts/
│   ├── clear-db.ts            # Database cleanup
│   └── posts.seed.ts          # Seed data generation
├── services/
│   └── posts.services.ts       # Post-related API calls
├── store/
│   ├── auth/
│   │   └── use-auth.store.ts   # Zustand auth store with persistence
│   └── global.store.ts         # Global application state
├── types/
│   ├── request.types.ts        # API request types
│   ├── response.types.ts       # API response types
│   └── user.types.ts           # User-related types
├── .env.example                # Environment variables template
├── biome.json                  # Biome configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

---

## 🛠 Setup & Development

### 1. Clone the repo

```bash
git clone https://github.com/yourname/vynspire-blog.git
cd vynspire-blog
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up `.env`

Copy `.env.example` to `.env` and update with your credentials:

```env
DB_PASSWORD=your_db_password
# Supabase connection pooling URL (for app runtime)
DATABASE_URL="postgresql://postgres.username:password@host:6543/postgres?pgbouncer=true"
# Direct connection URL (for migrations)
DIRECT_URL="postgresql://postgres.username:password@host:5432/postgres"
# JWT secret for token signing
JWT_SECRET=your_secure_jwt_secret_key
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# For development (creates and applies migrations)
npx prisma migrate dev

# Optional: Seed the database
npx tsx scripts/posts.seed.ts
```

### 5. Development Server

```bash
# Start development server with Turbopack
pnpm dev

# Alternative commands
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run Next.js linter
```

---

## 🧪 Key Features to Test

### Authentication
- ✅ User registration with email/password
- ✅ JWT-based login with persistent sessions
- ✅ Protected route navigation
- ✅ Automatic logout and token management

### Blog Management
- ✅ Create posts with rich text editor
- ✅ Edit existing posts with live preview
- ✅ Delete posts with confirmation dialogs
- ✅ Auto-generated read time calculation
- ✅ Category and tag management

### Content Features
- ✅ Advanced search across title, content, and tags
- ✅ Category-based filtering
- ✅ Pagination with customizable page sizes
- ✅ Responsive design for all screen sizes
- ✅ Dark/light theme with system preference

### Rich Text Editor
- ✅ Typography formatting (bold, italic, headings)
- ✅ Code blocks with syntax highlighting
- ✅ Image upload and resizing
- ✅ Link editing with bubble menus
- ✅ Horizontal rules and special characters

---

## 📦 Production Deployment

### Database Migrations
```bash
# Apply migrations in production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### Environment Variables
Ensure these are set in your production environment:
- `DATABASE_URL` - Supabase connection pooling URL
- `DIRECT_URL` - Direct database connection for migrations
- `JWT_SECRET` - Secure random string for JWT signing
- `DB_PASSWORD` - Database password

### Build Optimization
- Uses Next.js 15 with Turbopack for faster builds
- Automatic code splitting and optimization
- Image optimization with next/image
- CSS optimization with Tailwind CSS v4

---

## 🧹 Development Workflow

### Code Quality
- **Biome**: Unified formatter and linter (replaces ESLint + Prettier)
- **Husky**: Git hooks for pre-commit checks
- **Commitlint**: Conventional commit message enforcement
- **TypeScript**: Strict type checking throughout

### Code Organization
- **Custom Hooks**: Reusable logic for auth, data fetching
- **Service Layer**: Centralized API communication
- **Type Safety**: Comprehensive TypeScript definitions
- **Component Architecture**: Modular, reusable UI components

### Available Scripts
```bash
pnpm ci:check    # Check code formatting and linting
pnpm ci:write    # Auto-fix formatting issues
pnpm prepare     # Setup Husky git hooks
```

---

## 🏗️ Architecture Highlights

### Custom Hooks Pattern
- **Authentication**: `use-auth.hook.ts` with route protection
- **Data Fetching**: React Query integration for server state
- **Responsive Design**: `use-mobile.ts` for breakpoint detection

### State Management Strategy
- **Zustand**: Lightweight state management with persistence
- **React Query**: Server state caching and synchronization
- **Local Storage**: Persistent authentication state

### API Design
- **RESTful Endpoints**: Clean API structure with proper HTTP methods
- **Type-Safe Requests**: Zod schema validation on all endpoints
- **Error Handling**: Comprehensive error responses and client handling

### UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Code splitting and lazy loading
- **Theme System**: Seamless dark/light mode switching

---

## 🤝 Contributing

This project demonstrates modern React/Next.js patterns and best practices. Feel free to explore the codebase and suggest improvements!