# IDS Architecture Analysis Dashboard

An interactive dashboard that brings the research findings of _"Analysis of Intrusion
Detection System Architecture"_ to life. It is **not** a real intrusion detection
engine — there is no packet capture, no live network scanning, and no machine learning.
Every alert and metric in this system is entered manually by a human analyst; nothing is
auto-detected. The app is a knowledge, comparison, alert-logging, and evaluation-management
tool derived directly from the research report.

**Stack:** React (Vite) + Supabase (Postgres, Auth, Realtime, Edge Functions) + Tailwind CSS

---

## 1. Installing Locally

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm (comes with Node)
- Access to the project's Supabase backend (URL + publishable key — see below)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/aishaabbayamani-lab/ids-app.git
   cd ids-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a file named `.env.local` in the project root with:

   ```env
   VITE_SUPABASE_URL=https://skimvinyodbmfvyydepx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_epHwb7ATgc1qdMq__lzr5g_PAZPIoT7
   ```

   These connect the app to the project's existing Supabase backend (database, auth, and
   the two Edge Functions it depends on are already provisioned there). The publishable
   key is safe to use client-side — it's enforced by Row Level Security on the database
   side, not a secret. `.env.local` is gitignored and never committed.

   > Setting up a brand-new Supabase project instead of using the existing one? The full
   > SQL schema (5 tables, RLS policies, seed data) is documented in Appendix F of the
   > project report.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Vite will print a local URL (typically `http://localhost:5173`) — open it in your
   browser.

5. **(Optional) Build for production**

   ```bash
   npm run build
   npm run preview
   ```

   `npm run build` outputs to `dist/`; `npm run preview` serves that build locally so you
   can sanity-check it before deploying.

---

## 2. Using the Dashboard

# Test Account Credentials

**This file is gitignored — never commit it.** It exists only on your local machine. The
project's GitHub repo is public, so these credentials must never end up in README.md or
any other tracked file: anyone who finds them gets live admin write access to the Supabase
backend (create/delete users, alerts, etc.).

| Role    | Email                              | Password       |
| ------- | ---------------------------------- | -------------- |
| Admin   | `codeweeaver+idsadmin@gmail.com`   | `TestPass123!` |
| Analyst | `codeweeaver+idsanalyst@gmail.com` | `TestPass123!` |
| Viewer  | `codeweeaver+idsviewer@gmail.com`  | `TestPass123!` |

All three use a `+alias` on the same real Gmail address, so confirmation/notification
emails land in the normal inbox.

If you ever suspect these have leaked (e.g. accidentally committed, shared in a public
channel), rotate the passwords immediately via Supabase Dashboard → Authentication → Users.

### Logging in

Open the app and you'll land on the **Login** screen. Sign in with an email and password
for an existing account. There are three roles, each with different capabilities:

| Role        | Can do                                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| **Viewer**  | Read-only access to every page                                                                                 |
| **Analyst** | Everything a Viewer can, plus: log alerts, update alert status, add IDS configurations, log evaluation metrics |
| **Admin**   | Everything an Analyst can, plus: delete alerts, add attack types, manage users, change roles                   |

Don't have an account yet? Accounts are created by an existing admin (Settings → Create
User) — there's no public self-signup. If you're setting this up for the very first time
with no admin account at all, see the "Bootstrapping the first admin" note in the project
documentation.

> **Test accounts:** one admin, one analyst, and one viewer test account exist for this
> project. Their credentials are **not** in this file — this repo is public, and login
> details must never be committed. See `CREDENTIALS.md` in the project root (gitignored,
> local-only) for the actual values.

### Navigating the app

The sidebar on the left gives access to every page (Settings is admin-only and won't
appear for other roles):

- **Dashboard** — at-a-glance summary: total/open/critical alert counts, a 7-day alert
  trend chart, a radar chart comparing NIDS/HIDS/Hybrid detection capability, and the 5
  most recent alerts.

- **Alerts** — the full alert log. Search and filter by severity, IDS type, or status.
  Analysts and admins see an **Add Alert** button; clicking it opens a form (title,
  description, severity, IDS type, attack category). Existing alerts can be moved through
  **Mark Investigating → Resolve**; admins can also **Delete**. Updates from any user
  appear for everyone in real time without needing to refresh.

- **Architectures** — reference material comparing NIDS, HIDS, and Hybrid IDS: coverage,
  detection strength, limitations, and the underlying detection techniques
  (signature-based, anomaly-based, hybrid). No data entry on this page.

- **Attack Library** — a searchable library of attack types (DDoS, Malware, Phishing,
  etc.) with per-architecture detection ratings (Low/Medium/High/Very High). Admins see an
  **Add Attack Type** button to extend the library.

- **Evaluations** — pick an IDS configuration from the left-hand list to see its logged
  metrics as a bar chart and a table. Analysts and admins can **Add Config** (register a
  new IDS deployment to evaluate) and **Log Metric** (record a 0–100 score for one of the
  six metrics: detection accuracy, false positive rate, scalability, resource consumption,
  deployment complexity, real-time capability).

- **Settings** _(admin only)_ — manage users: see everyone's name, email, role, and join
  date; change a user between Analyst and Viewer inline; or click **Create User** to add a
  new account with a chosen role.

### A note on what's "real"

Every number and entry you see — alert severities, attack categories, evaluation scores —
was typed in by a person through one of the forms above. The charts and ratings visualize
that logged data; they do not reflect live network activity or an actual running detector.
