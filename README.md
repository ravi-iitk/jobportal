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

> Note: `.env` files are excluded from Git. Use `server/.env.example` and `client/.env.example` as templates.

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Edit `client/.env` if needed:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
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

## Deployment to Netlify

### 1. Database Setup
- Create a MongoDB Atlas cluster
- Get the connection string (replace `<password>` with your password)

### 2. GitHub Setup
- Code is already pushed to: https://github.com/ravi-iitk/jobportal

### 3. Netlify Deployment
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub account and select the `jobportal` repo
4. Build settings:
   - **Build command**: `cd client && npm run build`
   - **Publish directory**: `client/dist`
   - **Node version**: 18
5. Environment variables (in Netlify dashboard > Site settings > Environment variables):
   ```
   MONGO_URI=mongodb+srv://username:<password>@cluster.mongodb.net/jobportal?retryWrites=true&w=majority
   JWT_SECRET=your_long_random_secret_here
   JWT_EXPIRES_IN=7d
   CLIENT_ORIGIN=https://your-netlify-site.netlify.app
   NODE_ENV=production
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ```
6. Deploy!

### 4. MongoDB Atlas Setup
- Create database user
- Whitelist IP: `0.0.0.0/0` for Netlify functions
- Get connection string from Atlas dashboard

### 5. Gmail SMTP (for OTP emails)
- Enable 2FA on Gmail
- Generate App Password: Google Account > Security > App passwords
- Use the app password in SMTP_PASS (not your regular password)

The app will be live at your Netlify URL with all functionalities intact!
