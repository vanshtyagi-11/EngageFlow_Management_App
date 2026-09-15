import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../contexts/AppContext";
import Signup from "./Signup";

const Layout = () => {
  //   const { isOwner, navigate } = useAppContext();

  //   useEffect(() => {
  //     console.log(isOwner);
  //     if (!isOwner) {
  //       navigate("/");
  //     }
  //   }, [isOwner]);

  const { IsLogin } = useAppContext();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f9fb]">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pt-[62px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
