# MERN Blog — README

> Full-stack MERN blog application (Week 4 assignment). This README documents how the repo is organized, how to run the app, the API surface and examples, features implemented, troubleshooting tips, and where to add screenshots.

## Project overview

This repository contains a full-stack blog app built with:
Frontend: React (Vite), React Router, Tailwind, axios
Backend: Node.js, Express, Mongoose (MongoDB)
Features: user auth (register/login), create/edit/delete posts, categories, image upload, protected routes, pagination
The app demonstrates end-to-end integration of frontend and backend: the front-end calls the Express API, which persists data in MongoDB and returns JSON responses.

Project layout (top-level)
- `client/` — React front-end (Vite)
  - `src/` — React code (pages, components, services)
  - `package.json`, `vite.config.js`, `jsconfig.json`
- `server/` — Express API
  - `routes/`, `models/`, `middleware/`
  - `server.js`, `.env.example`
- `Week4-Assignment.md` — assignment brief and requirements
mern-blog/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Express.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
---

## Quick start — prerequisites

## Getting Started

Node.js (v16+ recommended; project tested with Node 18+)
npm (or yarn)
MongoDB (local or Atlas)
---

## Setup — step-by-step

1. Clone the repo
  ```powershell
  git clone <your-repo-url>
  cd mern-stack-integration-Stephen-Henya
  ```

2. Install server dependencies and configure environment
  ```powershell
  cd server
  npm install
  ```

  Copy `.env.example` to `.env` and edit the values. Minimal variables:
  ```text
  MONGODB_URI=mongodb://127.0.0.1:27017/mern-blog
  PORT=5000
  JWT_SECRET=your_jwt_secret_here
  NODE_ENV=development
  ```

  - If using MongoDB Atlas, set `MONGODB_URI` to your Atlas connection string.
  - `JWT_SECRET` should be a secure random string.

3. Install client dependencies
  ```powershell
  cd ../client
  npm install
  ```
4. Document your API and setup process in the README.md
  The client uses `VITE_API_URL` environment variable optionally. By default it calls `http://localhost:5000/api`. If your backend runs elsewhere, create a `.env` in `client/`:
  ```text
  VITE_API_URL=http://localhost:5000/api
  ```

4. Create uploads directory (server)
   ```powershell
   cd ../server
   mkdir uploads
   ```

5. Start servers

   In one terminal start the server:
   ```powershell
   cd server
   npm run dev
   # or: npm start
   ```

   In another terminal start the client:
   ```powershell
   cd client
   npm run dev
   ```

6. Open the app:
   - Frontend: http://localhost:5173 (default Vite port)
   - Backend API: http://localhost:5000

---

## Development scripts

From `server/`:
- `npm run dev` — start server with `nodemon`
- `npm start` — start server with `node`

From `client/`:
- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run preview` — preview production build
- `npm run lint` — run linter

---

## API documentation

Base URL (default): `http://localhost:5000/api`

Notes:
- Most endpoints expect or return JSON.
- Protected endpoints require a Bearer token in the `Authorization` header:
  ```
  Authorization: Bearer <token>
  ```
- The server stores uploaded files in `server/uploads` and serves them statically at `/uploads/<filename>`.

### Auth

- POST `/api/auth/register`
  - Request body (JSON):
    ```json
    { "name": "Alice", "email": "alice@example.com", "password": "password123" }
    ```
  - Response (returns auth payload):
    ```json
    {
      "token": "<jwt>",
      "user": { "_id": "...", "name": "Alice", "email": "alice@example.com" }
    }
    ```

- POST `/api/auth/login`
  - Request body:
    ```json
    { "email": "alice@example.com", "password": "password123" }
    ```
  - Response:
    ```json
    {
      "token": "<jwt>",
      "user": { "_id": "...", "name": "Alice", "email": "alice@example.com" }
    }
    ```

### Posts

- GET `/api/posts?page=1&limit=10`
  - Query params: `page`, `limit` (optional)
  - Response:
    ```json
    { "posts": [{ "_id":"...", "title":"...", "body":"...", "author":{"..."}, ... }], "total": 42, "page":1, "pages":5 }
    ```

- GET `/api/posts/:id` — Returns a single post (with populated `author` and `categories`).

- POST `/api/posts` (protected)
  - Request body:
    ```json
    {
      "title": "Post title",
      "body": "Post body content",
      "categories": ["<catId1>", "<catId2>"],
      "featuredImage": "http://localhost:5000/uploads/123.jpg"
    }
    ```
  - Response: created post object (201)

- PUT `/api/posts/:id` (protected) — Update fields same as create.

- DELETE `/api/posts/:id` (protected) — Response: `{ message: 'Post removed' }`

### Categories

- GET `/api/categories` — returns array of categories
- POST `/api/categories` — create category (protected)

### Uploads (images)

- POST `/api/upload` (protected)
  - Multipart form-data key must be `image`
  - Example using curl:
    ```bash
    curl -X POST "http://localhost:5000/api/upload" \\
      -H "Authorization: Bearer <token>" \\
      -F "image=@/path/to/file.jpg"
    ```
  - Response:
    ```json
    { "url": "http://localhost:5000/uploads/<generated-filename>.jpg" }
    ```

---

## Frontend structure & usage

Key pages (routes):
- `/` — Home / latest posts
- `/posts/:id` — Single post view
- `/create` — Create post form (protected)
- `/edit/:id` — Edit post form (protected)
- `/login` — Login form
- `/register` — Register form

Client service layer (`client/src/services/api.js`):
- Exposes `postService`, `categoryService`, and `authService`.
- The axios default instance is exported as default (used for raw uploads).

Auth flow:
- On login/register, the backend returns `{ token, user }`. The client stores `token` and `user` in `localStorage`.
- Axios request interceptor attaches `Authorization: Bearer <token>` to outgoing requests if token present.

---

## Features implemented (current)

- User registration and login (JWT)
- Create, read, update, delete posts
- Image uploads (multer on server)
- Categories (list/create)
- Protected routes (server middleware)
- Pagination support on `GET /api/posts`
- Client-side routing (React Router)
- Reusable UI components
- Form handling for create/edit post
- Delete action available on PostView and Home (owner-only)

---

## Screenshots

Add screenshots under `client/public/screenshots/` (create that folder). Example markdown to include images:

```markdown
![Home page](/screenshots/home.png)
![Login view](/screenshots/login.png)
![Create Post](/screenshots/create.png)
```

Place your screenshot images in `client/public/screenshots/` and commit them. If you prefer, link absolute images (e.g., hosted screenshots).

Suggested screenshots:
- Home page with posts list
- Create/Edit post form with image preview
- Post detail view with featured image
- Login / Register screen

---

## Troubleshooting & common issues

- `ERR_CONNECTION_REFUSED` from the client → backend server not running. Start server: `cd server && npm run dev`.
- `Network Error` or 401 on protected endpoints → ensure token exists in `localStorage` and axios interceptor attaches it. After login refresh the page.
- Upload returns 404 → server did not mount upload route. Confirm `server/server.js` contains `app.use('/api/upload', uploadRoutes);`.
- `ValidationError: slug is required` → fixed by generating slug before validation. If you encounter duplicate slug errors (E11000), resolve by changing title or implementing slug suffix logic.
- Multer write errors → ensure `server/uploads/` exists and Node process has write permissions.

---

## Tests & lint

- Lint: `cd client && npm run lint`
- There are no automated unit tests in the starter repo. Suggested follow-ups:
  - Add Jest + React Testing Library tests for components and pages.
  - Add integration tests for API endpoints using supertest.

---

## Next steps / improvements

- Improve slug uniqueness handling (append suffix for duplicates)
- Add server-side pagination and filtering (already basic; extend)
- Add role-based permissions
- Add comments feature with nested replies
- Add file size limits and image optimization
- Add E2E tests (Cypress)

---

## Notes for graders / reviewers

- The `server/.env.example` contains recommended environment variables. Copy to `.env` before running.
- The client reads `VITE_API_URL` at build time; change it if your backend uses a different host/port.

---

## License & contact

- License: Stephen Henya
- If you have questions or need help running the app, open an issue or contact the author.

---

