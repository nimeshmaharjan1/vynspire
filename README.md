# 📝 Vynspire Blog Platform

A modern blog platform built with **Next.js**, **Prisma**, and **Supabase**, focusing on clean UI/UX, scalable architecture, and full CRUD functionality with authentication.

---

## 🚀 Features

- 🔐 **JWT Auth** using Zustand persist and localStorage
- ✍️ **Create, Edit, Delete** posts with rich text content
- 🧠 **Custom Hooks**:
  - `use-auth.hook.ts` – handles login, logout, auth state
  - `use-get-all-posts.ts`, `use-get-post.ts` – fetch and view post data
- 🗃️ **Zustand** for global and auth state management
- 🎨 **ShadCN UI** + **Tailwind CSS** for clean design
- 🧪 **Form Handling** via React Hook Form + Zod schema validation
- 📝 **Rich Text Editor** with TipTap + ShadCN integration
- 🌗 **Dark/Light Theme** toggle
- 🔎 **Search & Filter** by category/tag
- 🔁 **Pagination**
- ⚙️ **Husky** + **Commitlint** + **Biome** (instead of ESLint/Prettier) for robust formatting & linting

---

## 🧩 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Auth**: JWT with Zustand & localStorage
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Styling**: TailwindCSS + ShadCN UI
- **Text Editor**: TipTap

---

## 📂 Project Structure

```
.
├── app
├── components
├── hooks
│   ├── auth
│   │   └── use-auth.hook.ts
│   └── posts
│       ├── use-get-all-posts.ts
│       ├── use-get-post.ts
│       └── use-mobile.ts
├── lib
├── prisma
├── public
├── scripts
├── services
│   └── posts.services.ts
├── store
│   ├── auth
│   │   └── use-auth.store.ts
│   └── global.store.ts
├── types
├── .env.example
├── next.config.ts
├── biome.json
└── ...
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

Copy `.env.example` to `.env` and update with your credentials (Supabase/PostgreSQL):

```env
DB_PASSWORD=your_db_password
DATABASE_URL=your_supabase_connection_pooling_url
DIRECT_URL=your_supabase_direct_url
JWT_SECRET=your_jwt_secret
```

### 4. Prisma Setup

```bash
npx prisma generate
npx prisma migrate deploy
```

Or during dev:

```bash
npx prisma migrate dev
```

### 5. Run Dev Server

```bash
pnpm dev
```

---

## 🧪 Testing Features

- ✅ Login / Register with JWT
- ✅ Create/Edit/Delete blog posts
- ✅ Search, Filter, Pagination
- ✅ Light/Dark mode
- ✅ Validation and rich text content
- ✅ Protected routes for dashboard actions

---

## 📦 Production Notes

- Use `npx prisma migrate deploy` for applying migrations
- Set proper `JWT_SECRET`, database credentials in production `.env`
- Consider using Supabase or your own PostgreSQL setup

---

## 🧹 Tooling & Conventions

- **Biome** for formatting and linting
- **Husky** + **Commitlint** for commit hygiene
- **Zod** + **React Hook Form** for validation
- **ShadCN** + **TailwindCSS** for UI consistency

---

## 🧑‍💻 Author

Developed as part of a frontend take-home test focused on:

- ✅ Custom Hooks
- ✅ State Management
- ✅ Authentication
- ✅ CRUD UI
- ✅ Code Reusability & Structure

---

Feel free to reach out for improvements or questions.