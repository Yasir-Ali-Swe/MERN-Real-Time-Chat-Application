# MERN Real-Time Chat Application

A full-stack real-time chat application built with the MERN stack. It includes custom authentication, email verification, real-time messaging with Socket.IO, image uploads, and user presence tracking.

This project is built as a portfolio project with production-style patterns and a clean architecture.

## Tech Stack

### Frontend

- React
- Tailwind CSS
- DaisyUI
- Zustand (state management)
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT (Access & Refresh Tokens)
- Cloudinary (image uploads)

## Features

### Authentication

- User registration
- Email verification
- Login and logout
- Access and refresh token based authentication
- Secure token rotation
- Protected routes

### Chat

- Real-time messaging using Socket.IO
- One-to-one chat
- Online users indicator
- Message persistence in database

### User Profile

- Complete profile after registration
- Upload profile image using Cloudinary
- Public user profiles

### Media

- Image upload in chat messages
- Cloudinary integration for secure media storage

## Project Structure

```text
root
├── client
│   ├── src
│   ├── components
│   ├── store
│   └── pages
├── server
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   └── socket
└── README.md
```

## Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_jwt_secret_key


CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:3000
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation and Setup

### Backend setup

```bash
cd server
npm install
npm run dev
```

### Frontend setup

```bash
cd client
npm install
npm run dev
```

The app should now be running on:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Socket.IO Flow

- User connects after authentication
- Socket ID is mapped to user ID
- Online users are tracked in memory
- Real-time events:
  - user online/offline
  - send message
  - receive message

## Security Notes

- Passwords are hashed before storage
- Access tokens are short-lived
- Refresh tokens are securely stored and rotated
- Protected routes use authentication middleware

## Future Improvements

- Group chats
- Message reactions
- Read receipts
- Typing indicators
- Pagination for chat messages
- Push notifications
<!-- 
## Screenshots

_Add screenshots here_ -->

## License

This project is free to use and open-source.

## Author

Yasir Ali  
Feel free to fork, use, and improve this project.
