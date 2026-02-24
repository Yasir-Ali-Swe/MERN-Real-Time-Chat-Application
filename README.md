# MERN Real-Time Chat Application (NexTalk)

A full-stack **real-time 1:1 chat application** built with the **MERN stack**, featuring **secure authentication**, **email verification**, **JWT access/refresh tokens**, **profile & image uploads**, and **Socket.io** powered real-time presence and messaging.

---

## Live Demo

- Frontend: (Live Link comming soon)

---

## Features

### Authentication & Security

- User registration
- **Email verification** flow (verification link emailed to user)
- Secure login
- **JWT auth with Access + Refresh tokens**
  - Access token for API calls
  - Refresh token stored in **HTTP-only cookie**
- Logout
- **Forgot password / reset password** via email
- Protected routes (client + server)
- Password hashing using **bcryptjs**
- Token revocation support via `tokenVersion` (server-side invalidation)

### Real-Time Chat

- **One-to-one messaging**
- Real-time delivery using **Socket.io**
- Online users presence (broadcasts online user IDs)
- Conversation support (conversation list + fetching conversation)
- Mark conversation/messages as **read**
- Text + **image messages** (file upload)

### User Profile

- Update profile data
- Upload avatar image
- Cloud image storage via **Cloudinary**

### Frontend (Client)

- Built with **React + Vite**
- Routing with **react-router-dom**
- State management with **Redux Toolkit**
- Server state & caching with **TanStack Query**
- API communication with **Axios**
- Socket client integration (**socket.io-client**)
- Styled with **TailwindCSS** + **shadcn/ui**
- Toast notifications via **react-hot-toast**
- Responsive UI

---

## Tech Stack

### Frontend

- React (Vite)
- TailwindCSS
- shadcn/ui
- Redux Toolkit
- TanStack Query
- Axios
- Socket.io Client

### Backend

- Node.js (ESM)
- Express
- MongoDB + Mongoose
- Socket.io
- JWT (jsonwebtoken)
- bcryptjs
- cookie-parser
- Nodemailer (Gmail transport)
- Multer (uploads)
- Cloudinary (image storage)

---

## Project Structure

### Client (`/client`)

- Vite + React app
- `src/` contains pages, routes, store, hooks, components, etc.
- Key dependencies: redux toolkit, tanstack query, axios, socket.io-client, tailwind

### Server (`/server`)

- Express API + Socket.io server
- `index.js` boots the API and socket server
- `routes/` API routes (users, messages, auth)
- `controllers/` request handlers (auth, message, user)
- `models/` Mongoose models (user, message, conversation)
- `middlewares/` auth + multer upload middleware
- `utils/` helpers (JWT helper, Cloudinary config, email sender)
- `emails/` HTML email templates (verify email, reset password)

---

## Environment Variables

Create a `.env` file in `server/` (and optionally in `client/` if you configure runtime env there).

### Server (`server/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_jwt_secret

# Nodemailer (Gmail)
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Client URL for email links
CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

> Notes:
>
> - Email templates generate links like: `${CLIENT_URL}/auth/verify-email/:token` and `${CLIENT_URL}/auth/reset-password/:token`
> - Use a Gmail **App Password** if 2FA is enabled.

---

## Getting Started (Local Setup)

### 1) Clone

```bash
git clone https://github.com/Yasir-Ali-Swe/MERN-Real-Time-Chat-Application.git
cd MERN-Real-Time-Chat-Application
```

### 2) Install dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 3) Run the app

#### Start backend

```bash
cd server
npm run dev
```

#### Start frontend

```bash
cd ../client
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5000 (or whatever `PORT` is)

---

## Real-time Socket Behavior (Summary)

- Server maintains a `userSocketMap` of `{ userId: socketId }`
- On connect, the client provides `userId` in the socket handshake query
- Server emits:
  - `getOnlineUsers` with list of currently online user IDs

---

## API Overview (High Level)

(Exact paths may vary—confirm in `server/routes/*.js`.)

### Users

- `GET /api/users` (protected)
- `PATCH /api/users/me` (protected, supports `avatar` upload)

### Messages / Conversations

- `POST /api/messages/send-message` (protected, supports `image` upload)
- `GET /api/messages/get-conversation/:conversationId` (protected)
- `GET /api/messages/get-user-conversations` (protected)
- `PATCH /api/messages/mark-as-read/:conversationId` (protected)

---

## Author

**Yasir-Ali-Swe**
