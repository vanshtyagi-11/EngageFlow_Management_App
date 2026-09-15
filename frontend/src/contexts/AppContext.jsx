import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  //   const currency = import.meta.env.VITE_CURRENCY;
  const [showModal, setShowModal] = useState(false);
  const [IsLogin, setIsLogin] = useState(
    Boolean(localStorage.getItem("engageflow_token"))
  );
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("Team Member");
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      if (!localStorage.getItem("engageflow_token"))
        return setAuthLoading(false);
      try {
        const { data } = await api.get("/api/users/me");
        setUser(data.user);
        setIsLogin(true);
      } catch {
        localStorage.removeItem("engageflow_token");
        setIsLogin(false);
      } finally {
        setAuthLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = (session) => {
    localStorage.setItem("engageflow_token", session.token);
    setUser(session.user);
    setIsLogin(true);
  };

  const logout = () => {
    localStorage.removeItem("engageflow_token");
    setUser(null);
    setIsLogin(false);
    navigate("/login");
  };

  const value = {
    navigate,
    api,
    user,
    authLoading,
    login,
    logout,
    showModal,
    setShowModal,
    IsLogin,
    setIsLogin,
    selectedRole,
    setSelectedRole,
    viewOpen,
    setViewOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
