import "./App.css";
import Clients from "./pages/Clients.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Engagements from "./pages/Engagements.jsx";
import Layout from "./pages/Layout.jsx";
import Tasks from "./pages/Tasks.jsx";
import Team from "./pages/Team.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/LoginPage.jsx";
import ProtectRoute from "./components/ProtectRoute.jsx";

import { Route, Routes, Navigate } from "react-router-dom";
import TaskList from "./components/TaskList.jsx";
import ClientPortal from "./pages/ClientPortal.jsx";
import Services from "./pages/Services.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";

function App() {
  return (
    <Routes>
      {/* Public Routes (without login accessible) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes (without login try to access redirect to /login) */}
      <Route element={<ProtectRoute />}>
        <Route path="/client-portal" element={<Layout />}>
          <Route index element={<ClientPortal />} />
          <Route
            path="request-work"
            element={<ClientPortal initialRequestOpen />}
          />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="engagements" element={<Engagements />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="clients" element={<Clients />} />
          <Route path="team" element={<Team />} />
          <Route path="services" element={<Services />} />
          <Route
            path="permissions"
            element={<ComingSoon section="Permissions" />}
          />
          <Route path="settings" element={<ComingSoon section="Settings" />} />
          <Route path="tasklist" element={<TaskList />} />
        </Route>
      </Route>

      {/* wrong or unknown URL fallback redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
