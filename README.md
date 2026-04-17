# MERN Clean Architecture Boilerplate

This repository now includes a MERN stack setup with authentication and a student profile flow:

- `client/`: React + Vite + Tailwind CSS + React Router
- `server/`: Node.js + Express + MongoDB + Mongoose

Included in this setup:

- JWT authentication with register and login APIs
- `User` and `StudentProfile` Mongoose models
- Protected student profile create/update and fetch APIs
- Register, login, and student details pages
- 105-question grouped scoring flow with saved submissions
- Backend analysis and recommendation endpoints

## Project Structure

```text
root/
|-- client/
|-- server/
`-- package.json
```

## Run Locally

Use `npm.cmd` in PowerShell on this machine because `npm.ps1` is blocked by execution policy.

### 1. Install dependencies

```powershell
npm.cmd install
npm.cmd install --prefix server
npm.cmd install --prefix client
```

Or use the root helper script after the first root install:

```powershell
npm.cmd run install:all
```

### 2. Configure environment variables

Create these files from the examples:

- `server/.env`
- `client/.env`

Server `.env` should include:

- `PORT`
- `NODE_ENV`
- `CLIENT_URL`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

### 3. Start development servers

In one command:

```powershell
npm.cmd run dev
```

Or separately:

```powershell
npm.cmd run dev --prefix server
npm.cmd run dev --prefix client
```

## Default URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/v1/health`
- Register API: `POST http://localhost:5000/api/v1/auth/register`
- Login API: `POST http://localhost:5000/api/v1/auth/login`
- Student profile API: `GET/POST http://localhost:5000/api/v1/student/profile`
- Questions API: `GET http://localhost:5000/api/v1/questions`
- Score submission API: `POST http://localhost:5000/api/v1/submit-scores`
- Analysis API: `POST http://localhost:5000/api/v1/analyze`
- Recommendations API: `GET http://localhost:5000/api/v1/recommendations`
- Download report API: `GET http://localhost:5000/api/v1/download-report`

## PDF Report

Authenticated users can download a structured PDF report from the results page or by calling:

- `GET /api/v1/download-report`

The report includes:

- Student details
- All 105 scores
- Total score
- Area-wise comparison
- Weak areas
- Recommendations
