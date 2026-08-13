# CheckMyPhone

Professional phone inspection & testing platform. Technicians perform standardized phone inspections and generate detailed reports.

## Features

- **Technician Login** — Unique ID & profile per technician
- **Phone Selection** — Brand → Model → Variant database (expandable)
- **30+ Point Testing** — Display, cameras, audio, hardware, connectivity, biometrics, sensors
- **Physical Condition** — Screen, body, frame, damage assessment with photos
- **IMEI Verification** — Pluggable IMEI lookup service
- **Location Tracking** — GPS coordinates for every inspection
- **Professional Reports** — Shareable, printable inspection reports
- **Admin Panel** — Manage technicians, phones, inspections, reports
- **Inspection History** — Track device history by IMEI
- **Mobile-First** — Optimized for technician field use
- **Light & Dark Mode** — System-aware with manual toggle
- **PWA** — Installable as a mobile app

## Tech Stack

- **Next.js 16** (App Router)
- **MongoDB** (Mongoose)
- **Razorpay** (ready for payment integration)
- **Framer Motion** (animations)
- **TypeScript**

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI, JWT secret, etc.

# Seed database (creates admin + technician + phone models)
npm run seed

# Start development server
npm run dev
```

## Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@checkmyphone.in | Admin@123 |
| Technician | tech@checkmyphone.in | Tech@123 |

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables:
   - `MONGODB_URI` — Your MongoDB Atlas connection string
   - `JWT_SECRET` — A long random string
   - `RAZORPAY_KEY_ID` — Your Razorpay key ID
   - `RAZORPAY_KEY_SECRET` — Your Razorpay secret
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` — Same as RAZORPAY_KEY_ID
   - `NEXT_PUBLIC_APP_URL` — Your Vercel domain
4. Deploy

## Inspection Flow

```
Login → Select Brand → Select Model → Enter IMEI →
Run Tests (Pass/Fail/Skip) → Physical Condition →
Add Photos & Comments → Submit → Generate Report
```

## Project Structure

```
src/
├── app/             # Next.js pages & API routes
│   ├── api/         # REST API endpoints
│   ├── admin/       # Admin dashboard
│   ├── technician/  # Technician dashboard
│   ├── inspect/     # Inspection wizard
│   ├── report/[id]/ # Public report page
│   └── login/       # Authentication
├── components/      # React components
│   ├── inspect/     # Inspection wizard components
│   ├── admin/       # Admin panel components
│   ├── report/      # Report view
│   └── technician/  # Technician dashboard
├── lib/             # Utilities, auth, DB, constants
├── models/          # Mongoose schemas
└── hooks/           # React hooks
```

## License

Private
