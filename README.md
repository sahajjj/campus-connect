# VIT Bhopal Anonymous Chat Platform 🎓

A scalable, secure, and exclusive randomized chat and video platform for VIT Bhopal students.

## Features
- **OTP based Auth**: Strictly restricts domains to `@vitbhopal.ac.in` via nodemailer.
- **WebRTC Video Chat**: True P2P video chat with STUN/TURN handling.
- **WebSocket Text Chat**: Socket.io backed real-time text delivery.
- **Smart Queueing**: Redis-based backend queue handles matchmaking, quick-skips, and disconnects gracefully.
- **Responsive UI**: Glassmorphic, highly animated (Framer Motion) standard layout for mobile/desktop.

## Architecture Highlights
- Frontend: Next.js 14 App Router, Zustand, Tailwind
- Backend: Express, Socket.io, JWT
- Database/Cache: MongoDB, Redis
- Containerized via Docker

## Quick Setup

### Backend
1. `cd backend`
2. Configure `.env` with Mongo, Redis, and SMTP details.
3. `npm install`
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

### Docker (For Production)
Ensure Redis and Mongo exist, set their urls in `backend/.env`
Build: `docker build -t vit-omegle-backend ./backend`
Run: `docker run -p 5000:5000 --env-file ./backend/.env vit-omegle-backend`
