# PickItUp — Courier Logistics Frontend

A React frontend for **PickItUp**, a courier logistics management platform that lets an admin team create and track pickup jobs, assign them to delivery partners, and manage the full lifecycle through to dispatch — including item tracking, photo evidence, invoices, POD slips, and a full audit trail.

Built on top of a Node.js/Express/MongoDB backend (JWT auth, BullMQ + Puppeteer for PDF generation, Cloudinary for file storage).

## Features

### Admin
- **Dashboard** — searchable, filterable list of all jobs (status, assigned partner, date range, client name)
- **Create Job** — new pickup jobs with client details, scheduling, and network selection
- **Partners** — view, create, and deactivate/reactivate delivery partners
- **Job Detail** — a single view per job covering:
  - Assign / self-assign
  - Manual status updates
  - Lock / unlock (with reason tracking)
  - Items and photo management
  - Receiver & package details (supports multiple packages per job)
  - Invoice & POD slip generation, checking, downloading, and regenerating
  - Deferred invoice completion (when a partner defers pricing to the office)
  - Shipment recording (tracking ID, carrier network)
- **Audit Log** — full chronological history of every significant event on a job (created, assigned, locked/unlocked, status changes, documents generated, dispatched), with actor attribution

### Partner
- **My Jobs** — assigned jobs list, filterable by status and date range
- **Job Detail** — save-as-you-go pickup flow:
  - Add/edit/delete items
  - Upload labelled photos
  - Fill in receiver details and per-package weight/dimensions
  - Submit (generates invoice + POD slip) or Defer Invoice (POD slip only, invoice completed later by admin)

### Shared
- Role-based authentication (separate Admin/Partner login, single merged login screen with tab switching)
- Change password
- Session persistence across refreshes via httpOnly cookies

## Tech Stack

- **Framework:** React (Vite)
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4 + DaisyUI
- **HTTP:** Axios
- **Icons:** Lucide React
- **Notifications:** react-hot-toast

## Project Structure

```
src/
├── admin/           # Admin-only pages (dashboard, job detail, partners, create job/partner)
├── partner/          # Partner-only pages (dashboard, job detail)
├── auth/              # Login, change password, logout
├── jobs/              # Shared job-detail components used by both Admin and Partner
│   (Items, PhotoUpload, JobDetailsForm, SubmitSection, Shipment, JobTimeline, JobSummary)
├── components/       # App shell (Layout, AuthGate, Landing)
├── context/           # AuthContext, useAuth hook
├── api/                # Configured axios instance
└── assets/            # Static assets
```

## Getting Started

### Prerequisites
- Node.js
- A running instance of the [PickItUp backend](#) with the API reachable

### Installation

```bash
git clone https://github.com/tirumalateja19/CourierApp-Frontend.git
cd CourierApp-Frontend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000
```

### Run the dev server

```bash
npm run dev
```

## Authentication Notes

- Auth uses httpOnly, secure cookies — the frontend never handles the JWT directly.
- Sessions are verified on every load via a `/me`-style endpoint, so refreshing the page doesn't log you out.
- Routes are protected by role (`admin` / `partner`); visiting a route you don't have access to redirects you to your own dashboard.

## License

This project is currently private/unlicensed.
