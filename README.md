# 🚀 TrackFlow — AI-Powered Job Application Tracker

TrackFlow is a high-performance, full-stack job application tracker designed to help developers and job seekers organize, manage, and optimize their job search pipeline. Built with modern web technologies, it features an interactive drag-and-drop Kanban board, data analytics, CSV export, and seamless cloud data persistence.

![TrackFlow Banner](https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Features

- 🎯 **MediaJel-Inspired Aesthetic**: Vibrant gradient hero section with custom color themes, clean contrast, and responsive layout.
- 📋 **Interactive Kanban Board**: Drag-and-drop application pipeline with real-time status transitions using `@hello-pangea/dnd`.
- 📊 **Table & Analytics View**: Dual-view toggle between Kanban columns and a data-rich tabular list with instant status badges.
- 💾 **Data Export & Backup**: One-click CSV export for Excel/Google Sheets and full JSON backup/restore functionality.
- ⚡ **Full-Stack Cloud Persistence**: Integrated Next.js App Router API endpoints connected to PostgreSQL database via Prisma ORM.
- 🔍 **Real-time Search & Filter**: Filter job cards by role, company name, or status instantly.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: [Prisma](https://www.prisma.io/) + [PostgreSQL (Supabase/Neon)](https://supabase.com/)
- **Drag and Drop**: [`@hello-pangea/dnd`](https://github.com/hello-pangea/dnd)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📂 Project Architecture

```text
src/
├── app/
│   ├── api/
│   │   └── jobs/
│   │       └── route.ts          # REST API endpoints (GET, POST, PATCH, DELETE)
│   ├── layout.tsx
│   └── page.tsx                  # Main entry page
├── components/
│   ├── Navbar.tsx                # Header & navigation
│   ├── HeroSection.tsx           # MediaJel gradient hero section
│   ├── AddJobModal.tsx           # Application form modal
│   └── KanbanBoard.tsx           # Interactive drag-and-drop board
├── lib/
│   └── prisma.ts                 # Prisma singleton instance
└── types/
    └── job.ts                    # TypeScript data definitions
