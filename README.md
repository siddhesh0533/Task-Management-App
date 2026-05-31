# TaskApp — Employee Task & Daily Work Report Management System

A full-stack MERN application where managers can assign tasks to employees, employees can update task status, and submit daily work reports.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcrypt |

---

## Features

- JWT-based login & registration
- Role-based access — **Manager** and **Employee**
- Manager: create tasks, assign to employees, edit, delete, view all reports
- Employee: view assigned tasks, update status, submit daily work reports
- Role-aware dashboard with task summary
- Search & filter tasks by status
- Responsive UI

---

## Project Structure

```
Task-Management-App/
├── TaskApp-Server/         # Express REST API
│   ├── config/             # MongoDB connection
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth, role guard, validation
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── validators/         # express-validator rules
│   └── index.js            # Entry point
│
└── TaskApp-Client/         # React SPA
    └── src/
        ├── api/            # Axios instance
        ├── components/     # Reusable UI components
        ├── context/        # AuthContext (JWT state)
        └── pages/          # Route-level page components
```

---

## Local Setup

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/siddhesh0533/Task-Management-App.git
cd Task-Management-App
```

### 2. Backend setup

```bash
cd TaskApp-Server
npm install
```

Create a `.env` file in `TaskApp-Server/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskapp?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the server:
```bash
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Frontend setup

```bash
cd TaskApp-Client
npm install
```

Create a `.env` file in `TaskApp-Client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the client:
```bash
npm run dev
```

Client runs at `http://localhost:5173`

---

## Demo Credentials

Register accounts manually via the app. Use the role selector on the Register page to create a Manager and an Employee account.

---

## API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| GET | `/api/tasks` | Both roles |
| POST | `/api/tasks` | Manager |
| GET | `/api/tasks/:id` | Both roles |
| PUT | `/api/tasks/:id` | Both roles |
| DELETE | `/api/tasks/:id` | Manager |
| GET | `/api/tasks/summary` | Both roles |
| GET | `/api/reports` | Both roles |
| POST | `/api/reports` | Employee |
| GET | `/api/reports/:id` | Both roles |
| GET | `/api/users` | Manager |

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repo, set root directory to `TaskApp-Server`
4. Set environment variables in Render dashboard (same as `.env`)
5. Build command: `npm install` · Start command: `npm start`

### Frontend → Vercel

1. Create a new project on [vercel.com](https://vercel.com)
2. Connect your GitHub repo, set root directory to `TaskApp-Client`
3. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com/api`
4. Deploy

---

## Author

Siddhesh Patil — [GitHub](https://github.com/siddhesh0533)
