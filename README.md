# Mini Job Portal Dashboard

A full-stack MERN recruiter dashboard for managing job posts and applicants.

## Features

- Recruiter signup/login with JWT
- Protected dashboard
- Create, edit, delete, filter job posts
- Applicant tracking and status updates
- Internal notes for applicants
- Dark mode
- Responsive Tailwind UI
- Docker setup

## Local Setup

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Edit `server/.env` if needed:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mini-job-portal
JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Frontend: http://localhost:3000  
Backend: http://localhost:5000

## Docker Setup

```bash
cp server/.env.example server/.env
# In server/.env, set MONGO_URI=mongodb://mongo:27017/mini-job-portal
docker-compose up --build
```

## API Routes

### Auth

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `PUT /api/v1/auth/me`

### Jobs

- `GET /api/v1/jobs`
- `POST /api/v1/jobs`
- `GET /api/v1/jobs/:id`
- `PUT /api/v1/jobs/:id`
- `DELETE /api/v1/jobs/:id`
- `PATCH /api/v1/jobs/:id/status`
- `GET /api/v1/jobs/stats/dashboard`

### Applicants

- `GET /api/v1/applicants`
- `GET /api/v1/applicants/job/:jobId`
- `POST /api/v1/applicants/job/:jobId`
- `GET /api/v1/applicants/:id`
- `PATCH /api/v1/applicants/:id/status`
- `PUT /api/v1/applicants/:id/notes`
- `DELETE /api/v1/applicants/:id`

## Deployment

- Frontend: Vercel
- Backend: Render/Railway
- Database: MongoDB Atlas

Set environment variables on each platform before deploying.
