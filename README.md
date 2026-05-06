# 📋 Team Task Manager - Full-Stack Web App

A complete team collaboration platform with project management, task tracking, and role-based access control. Built with Node.js, Express, MongoDB, and React.

## 🎯 Features

✅ **User Authentication**
- Signup/Login with JWT tokens
- Password hashing with bcryptjs
- Role-based access (Admin/Member)

✅ **Project Management**
- Create, edit, delete projects
- Add/remove team members
- Project status tracking

✅ **Task Management**
- Create and assign tasks
- Update task status (To Do → In Progress → Done)
- Priority levels (Low, Medium, High)
- Due date tracking
- Overdue task detection

✅ **Dashboard**
- Task statistics (Total, To Do, In Progress, Done)
- Completion rate
- Overdue tasks list
- Real-time metrics

✅ **Role-Based Access**
- **Admin**: Full control over projects and tasks
- **Member**: Can view and update assigned tasks

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Node.js + Express.js |
| **Frontend** | React 18 + Vite |
| **Database** | MongoDB (Atlas) |
| **Authentication** | JWT (JSON Web Tokens) |
| **Styling** | CSS3 |
| **Deployment** | Railway |

---

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── User.js               # User schema with auth
│   │   ├── Project.js            # Project schema
│   │   └── Task.js               # Task schema
│   ├── routes/
│   │   ├── auth.js               # Auth endpoints
│   │   ├── projects.js           # Project CRUD
│   │   └── tasks.js              # Task CRUD
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── roleCheck.js          # Role-based checks
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── projectController.js  # Project logic
│   │   └── taskController.js     # Task logic
│   ├── server.js                 # Express app entry
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   └── ProtectedRoute.jsx # Auth check
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Signup.jsx        # Signup page
│   │   │   ├── Dashboard.jsx     # Dashboard page
│   │   │   ├── Projects.jsx      # Projects page
│   │   │   └── Tasks.jsx         # Tasks page
│   │   ├── utils/
│   │   │   └── api.js            # API calls
│   │   ├── styles/
│   │   │   ├── index.css
│   │   │   ├── Navbar.css
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Projects.css
│   │   │   ├── Tasks.css
│   │   │   └── App.css
│   │   ├── App.jsx               # Main React component
│   │   └── main.jsx              # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18.x or higher
- MongoDB Atlas account (free tier works)
- Git

### Step 1: Clone & Setup Backend

```bash
cd task-manager/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# Example:
# PORT=5000
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
# JWT_SECRET=your_super_secret_key_here
# NODE_ENV=development
# FRONTEND_URL=http://localhost:5173
```

**Install dependencies:**
```bash
npm install
```

**Start backend:**
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Step 2: Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (default localhost:5000 is fine)
```

**Start frontend:**
```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ("Admin" | "Member"),
  projects: [ObjectId], // Project references
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  owner: ObjectId (User),
  members: [ObjectId], // User references
  tasks: [ObjectId], // Task references
  status: String ("Active" | "Paused" | "Completed"),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  project: ObjectId (Project),
  assignedTo: ObjectId (User),
  createdBy: ObjectId (User),
  status: String ("To Do" | "In Progress" | "Done"),
  priority: String ("Low" | "Medium" | "High"),
  dueDate: Date,
  isOverdue: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/signup      → Register new user
POST   /api/auth/login       → Login & get JWT
GET    /api/auth/me          → Get current user (requires JWT)
```

### Projects
```
POST   /api/projects                  → Create project
GET    /api/projects                  → Get all user's projects
GET    /api/projects/:id              → Get project details
PUT    /api/projects/:id              → Update project (Admin only)
DELETE /api/projects/:id              → Delete project (Admin only)
POST   /api/projects/:id/members      → Add member (Admin only)
DELETE /api/projects/:id/members      → Remove member (Admin only)
```

### Tasks
```
POST   /api/tasks                     → Create task
GET    /api/tasks                     → Get all tasks (with filters)
GET    /api/tasks/:id                 → Get task details
PUT    /api/tasks/:id                 → Update task
DELETE /api/tasks/:id                 → Delete task
GET    /api/tasks/status/overdue      → Get overdue tasks
GET    /api/tasks/stats/dashboard     → Get dashboard statistics
```

---

## 🔐 Authentication Flow

1. **Signup**: User registers with name, email, password, and role
2. **Password Hashing**: Password hashed with bcryptjs before saving
3. **JWT Token**: Generated after successful login/signup
4. **Token Storage**: Stored in localStorage on frontend
5. **API Requests**: Token sent in `Authorization: Bearer <token>` header
6. **Token Verification**: Backend validates token on protected routes

---

## 🎭 Role-Based Access Control

### Admin Privileges
- ✅ Create projects
- ✅ Add/remove team members
- ✅ Create tasks
- ✅ Assign tasks to anyone
- ✅ Edit/delete any task
- ✅ View all project details

### Member Privileges
- ✅ View assigned projects
- ✅ View assigned tasks
- ✅ Update task status
- ✅ View personal dashboard
- ❌ Cannot create projects
- ❌ Cannot assign tasks

---

## 🧪 Testing the API

### Using Postman/Insomnia:

**1. Signup User**
```
POST http://localhost:5000/api/auth/signup
Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Admin"
}
```

**2. Login**
```
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "john@example.com",
  "password": "password123"
}
Response includes JWT token
```

**3. Create Project** (with Authorization header)
```
POST http://localhost:5000/api/projects
Header: Authorization: Bearer <your_jwt_token>
Body:
{
  "name": "Website Redesign",
  "description": "Redesign company website"
}
```

**4. Create Task**
```
POST http://localhost:5000/api/tasks
Header: Authorization: Bearer <your_jwt_token>
Body:
{
  "title": "Design homepage",
  "description": "Create UI design",
  "projectId": "project_id_here",
  "assignedTo": "user_id_here",
  "priority": "High",
  "dueDate": "2025-06-15"
}
```

---

## 🌐 Deployment to Railway

### Backend Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Connect GitHub repository
   - Select `backend` folder
   - Railway auto-detects Node.js
   - Add MongoDB service (Railway provides)
   - Set environment variables:
     - `MONGODB_URI` (from Railway MongoDB)
     - `JWT_SECRET`
     - `NODE_ENV=production`
     - `FRONTEND_URL` (your Vercel/Railway frontend URL)
   - Deploy

3. **Get Backend URL**
   - Railway provides a public URL
   - Use in frontend `.env` as `VITE_API_URL`

### Frontend Deployment

**Option A: Vercel (Recommended)**
1. Connect your GitHub repo to Vercel
2. Select `frontend` folder
3. Set `VITE_API_URL` to your Railway backend URL
4. Deploy

**Option B: Railway**
1. Create new project on Railway
2. Connect GitHub repo
3. Select `frontend` folder
4. Set build command: `npm run build`
5. Set start command: `npm run preview`
6. Deploy

---

## 📝 Key File Explanations

### Backend Files

**`server.js`** - Express app setup
- Creates Express server
- Connects to MongoDB
- Registers routes
- Handles CORS

**`config/db.js`** - Database connection
- MongoDB connection logic
- Error handling

**`models/*.js`** - Mongoose schemas
- Define data structure
- Add validations
- Pre/post hooks

**`controllers/*.js`** - Business logic
- Authentication logic
- CRUD operations
- Data validation

**`middleware/auth.js`** - JWT verification
- Validates tokens
- Extracts user info

**`middleware/roleCheck.js`** - Role verification
- Checks if user is Admin
- Restricts endpoints

**`routes/*.js`** - API endpoints
- Maps HTTP methods to controllers
- Applies middleware

### Frontend Files

**`App.jsx`** - Main React component
- Router setup
- Route definitions
- Layout structure

**`pages/*.jsx`** - Page components
- Login/Signup forms
- Dashboard view
- Projects & tasks CRUD

**`components/*.jsx`** - Reusable components
- Navbar
- Protected route wrapper

**`utils/api.js`** - API integration
- Axios instance
- All API calls
- Token management

**`styles/*.css`** - Styling
- Responsive design
- Component styling

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Cannot connect to MongoDB** | Check connection string, whitelist IP on Atlas |
| **CORS errors** | Ensure `FRONTEND_URL` in backend `.env` is correct |
| **JWT token invalid** | Regenerate `.env` with new `JWT_SECRET` |
| **Frontend can't reach backend** | Check backend URL in frontend `.env` |
| **Port 5000 already in use** | Change PORT in backend `.env` |
| **Tasks not showing overdue** | Ensure dueDate is in past and status ≠ "Done" |

---

## 📊 Dashboard Metrics

- **Total Tasks**: Count of all tasks (any status)
- **To Do**: Count of tasks with status "To Do"
- **In Progress**: Count of tasks with status "In Progress"
- **Done**: Count of completed tasks
- **Overdue**: Count of tasks past due date (not completed)
- **Completion Rate**: Percentage of done tasks vs total tasks

---

## 🔒 Security Features

✅ Password hashing with bcryptjs
✅ JWT token-based authentication
✅ Role-based access control
✅ Input validation on all endpoints
✅ CORS protection
✅ Protected routes on frontend
✅ Environment variables for secrets
✅ MongoDB injection prevention (Mongoose)

---

## 📦 Submission Checklist

- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel/Railway
- [ ] Live URL working
- [ ] GitHub repo with clean commits
- [ ] README with setup instructions
- [ ] Demo video (2-5 min) showing:
  - [ ] User signup/login
  - [ ] Create project & add members
  - [ ] Create & assign task
  - [ ] Update task status
  - [ ] View dashboard
  - [ ] Admin vs Member features
- [ ] All features working in production

---

## 🎥 Demo Video Script (2-5 minutes)

```
1. Intro (30 sec)
   "This is Team Task Manager - a full-stack web app for team collaboration"

2. Login (30 sec)
   Show login page → login with demo credentials

3. Dashboard (30 sec)
   Show dashboard with metrics, overdue tasks

4. Create Project (30 sec)
   Create new project, show project creation

5. Add Members (30 sec)
   Add team members to project

6. Create Task (1 min)
   Create task, assign to member, set priority/due date

7. Update Status (30 sec)
   Show updating task status (To Do → In Progress → Done)

8. Admin Features (30 sec)
   Switch to Admin account, show additional permissions

9. Conclusion (30 sec)
   "Features: Authentication, Projects, Tasks, Dashboard, Role-based access"
```

---

## 🚀 Next Steps

1. **Setup MongoDB Atlas** (if not done)
2. **Install backend dependencies**: `npm install`
3. **Configure .env files**
4. **Start backend**: `npm run dev`
5. **Start frontend**: `npm run dev`
6. **Test locally**
7. **Push to GitHub**
8. **Deploy on Railway**
9. **Record demo video**
10. **Submit!**

---

## 📞 Support

For issues or questions:
- Check MongoDB connection
- Verify environment variables
- Check browser console for errors
- Check backend terminal for API errors

---

## 📄 License

MIT

---

**Built with ❤️ for team collaboration**
