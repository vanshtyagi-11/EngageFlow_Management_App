# EngageFlow

EngageFlow is a modern work management platform designed for managing clients, teams, services, engagements, and tasks from one centralized dashboard.

## Live Demo

[Open EngageFlow Live Demo](YOUR_LIVE_LINK_HERE)

## Features

- User signup and login
- Role-based access control
- Manager, Team Member, and Client roles
- Dashboard with business activity overview
- Client management
- Team member management
- Service management
- Engagement management
- Task creation and tracking
- Task status and priority management
- Task count displayed in sidebar
- Client portal
- Client work request submission
- Admin permissions section
- Settings section
- Protected routes for authenticated users
- Responsive design for desktop, tablet, and mobile
- Mobile sidebar navigation
- Notifications and profile menu UI
- REST API integration
- MongoDB database integration

## User Roles

### Manager

- Manage clients
- Manage team members
- Manage services
- Manage engagements
- Manage tasks
- View dashboard data
- Access administration sections

### Team Member

- View assigned work
- Manage tasks
- View engagements and clients based on permissions

### Client

- Access client portal
- View portal information
- Submit new work requests

## Technologies Used

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Axios
- React Hot Toast
- Motion

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Express Validator
- CORS
- dotenv

### Deployment

- Vercel
- REST API architecture

## Project Structure

```
EngageFlow/
├── backend/
│   ├── configs/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── lib/
    │   ├── pages/
    │   ├── App.jsx
    │   └── App.css
    ├── index.html
    └── package.json
```

API Modules
The backend provides APIs for:

Users
->Clients
->Services
->Engagements
->Tasks
->Dashboard
->Admin permissions
->Client portal


Getting Started Prerequisites
Make sure you have installed:
-> Node.js
-> MongoDB
-> npm

Clone the Repository
-> git clone YOUR_GITHUB_REPOSITORY_URL
-> cd EngageFlow

Backend Setup
-> cd backend
-> npm install
-> npm run dev

Create a .env file inside the backend folder:

-> PORT=3000
-> MONGO_URI=your_mongodb_connection_string
-> JWT_SECRET=your_jwt_secret

The backend server will run on: http://localhost:3000/

Open a new terminal:
-> cd frontend
-> npm install
-> npm run dev

Create a .env file inside the frontend folder:
VITE_BASE_URL=http://localhost:3000

Future Improvements
-->Real-time notifications
-->File attachments for tasks
-->Advanced analytics and reports
-->Calendar integration
-->Email notifications
-->Dark mode
-->Automated testing
-->Activity timeline and audit history

Author
Created by Vansh Tyagi
