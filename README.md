# 📝 Finance Tracker

A simple personal finance tracker built with Next.js, Supabase Auth, Prisma, and PostgreSQL.
You can track **income & expenses**, see your **balance**, and visualize your financial activity with charts.

🔗 **Live Demo:** [finance-tracker.vercel.app](https://finance-tracker-taupe-three.vercel.app)

## 🖼️ Screenshot

![Finance Tracker Screenshot](./public/ss.png)

---

## ✨ Features

### 🔐 Authentication with Supabase

- Only logged-in users can manage their transactions

### 💰 Transaction Management

- Add new transactions (income / expense)
- Edit existing transactions (modal dialog)
- Delete transactions with confirmation dialog
- Note & category for each transaction
- Date picker for transaction date

### 📊 Dashboard

- Total Income, Expense, and Balance
- Income vs Expense chart (using react-chartjs-2 + chart.js)
- Aggregation using Prisma (sum income & expense)

### 📑 Transactions Page

- Paginated list of transactions
- Filter by type (income/expense)
- Filter by date range (from/to)
- Sort by date (newest first)

### ✅ Validation & UX

- Form validation with zod + react-hook-form
- Server Actions with Zod validation for extra safety
- Loading state on submit (button spinner)
- Dialogs for create & edit using shadcn/ui
- Skeleton UI while dashboard is loading (using loading.tsx)

---

## 🚀 Tech Stack

- **Next.js 14 (App Router)**
- **React 18 / Server Components**
- **shadcn/ui**
- **TypeScript**
- **Prisma ORM**
- **Supabase (PostgreSQL Database)**
- **Tailwind CSS**
- **Zod** (schema validation)
- **Vercel** (deployment target)
- **chart.js**

## 🛠️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/octavianusfian/task-tracker-nextjs.git
cd finance-tracker
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
# or
pnpm install
```

### 3. Set up environtment variabels

create .env

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres
```

Make sure to replace credentials with your Supabase connection string

### 4. Set up the database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app should be available at:
http://localhost:3000

---

## 🧩 Future Improvements

- Categories management
- Multi-currency support
- Recurring transactions (Automatically generate monthly bills, subscriptions, or salaries)


## 🧑‍💻 Author

**Octavianus Fian**
Front-end developer learning fullstack web development
