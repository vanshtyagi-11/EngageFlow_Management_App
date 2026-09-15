import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const ProtectedRoute = () => {
  const { IsLogin, authLoading } = useAppContext();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  // if user not  logged in, then user will redirect to /login .
  if (!IsLogin) {
    return <Navigate to="/login" replace />;
  }

  // if logged in, then protect route (children) will render.
  return <Outlet />;
};

export default ProtectedRoute;
