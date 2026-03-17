# Bus Booking System

Full-stack bus booking app with React, Express, and MongoDB.

## Tech Stack

- Frontend: React + TypeScript + React Router + Axios + Tailwind CSS
- Backend: Node.js + Express + Mongoose
- Database: MongoDB / MongoDB Atlas

## Backend Setup

Create `backend/.env` from [backend/.env.example](c:/Users/ROG/OneDrive/Desktop/bus-booking-system/backend/.env.example).

Example:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/bus-booking-system
PORT=5000
```

Run backend:

```bash
cd backend
npm install
node server.js
```

On first run, the backend seeds buses and demo bookings from `backend/data/*.json` into MongoDB if the collections are empty.

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`.
Backend runs on `http://localhost:5000`.

## API Endpoints

- `GET /api/buses`
- `GET /api/buses/:busId`
- `GET /api/bookings`
- `POST /api/bookings`

## Deployment Direction

- Frontend: Vercel / Netlify
- Backend: Render / Koyeb
- Database: MongoDB Atlas
