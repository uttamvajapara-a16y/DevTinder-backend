# Dev-Tinder — Backend

The **Node.js + Express backend** powering Dev-Tinder, a Tinder-style developer networking platform. Handles authentication, user profiles, connection requests, and real-time chat.

🔗 **Live Frontend:** [dev-tinder-web-nine-sand.vercel.app](https://dev-tinder-web-nine-sand.vercel.app/)
🔗 **Frontend Repo:** [devtinder-web](https://github.com/uttamvajapara-a16y/devtinder-web)

---

## ✨ Features

- **JWT Authentication** — Secure signup/login with hashed passwords and token-based auth
- **User Profiles** — CRUD APIs for managing developer profiles
- **Connection Requests** — Send, accept, reject, and view connection requests
- **Feed API** — Returns developers excluding the user's existing connections and pending requests
- **Real-Time Chat** — Socket.io-powered messaging between connected users
- **Data Validation & Sanitization** — Input validation to protect against malformed/malicious requests

## 🛠️ Tech Stack

- **Node.js** — Runtime
- **Express.js** — Web framework
- **MongoDB + Mongoose** — Database and ODM
- **Socket.io** — Real-time bidirectional communication for chat
- **JSON Web Token (JWT)** — Authentication
- **bcrypt** — Password hashing

## 📦 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- A MongoDB instance (local or MongoDB Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/uttamvajapara-a16y/devtinder-backend.git
cd devtinder-backend

# Install dependencies
npm install

# Start the server
npm start
```

The server will run on `http://localhost:3000` (or your configured port) by default.

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

## 📁 Project Structure

```
devtinder-backend/
├── configu         # db connection
├── middlewares/    # Auth middleware, validation, error handling
├── models/         # Mongoose schemas (User, ConnectionRequest, Chat, etc.)
├── routers/        # API route handlers (auth, profile, requests, chat)
├── src/app.js      # Entry point
└──  utils/         # Helper functions


```

## 🔌 API Overview

| Method | Endpoint                  | Description                          |
|--------|---------------------------|---------------------------------------|
| POST   | `/signup`                 | Register a new user                  |
| POST   | `/login`                  | Authenticate and receive a JWT        |
| GET    | `/profile`                | Get logged-in user's profile          |
| PATCH  | `/profile/edit`           | Update profile details                |
| GET    | `/feed`                   | Get list of discoverable developers   |
| POST   | `/request/send/:status/:id` | Send a connection request           |
| POST   | `/request/review/:status/:id` | Accept/reject a connection request |
| GET    | `/connections`            | Get all accepted connections          |


## 💬 Real-Time Chat

Chat is implemented using **Socket.io**. When two users are connected, they can exchange messages in real time without page refresh. Socket events are namespaced per chat room (typically a combination of both user IDs).

## 🔗 Related Repository

- **Frontend (React.js):** [devtinder-web](https://github.com/uttamvajapara-a16y/devtinder-web)

## 👤 Author

**Uttam Vajapara**
- GitHub: [@uttamvajapara-a16y](https://github.com/uttamvajapara-a16y)

## 📄 License

This project is open source and available for learning purposes.
