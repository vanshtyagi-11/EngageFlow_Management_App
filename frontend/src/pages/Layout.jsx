import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../contexts/AppContext";

const Layout = () => {
  //   const { isOwner, navigate } = useAppContext();

  //   useEffect(() => {
  //     console.log(isOwner);
  //     if (!isOwner) {
  //       navigate("/");
  //     }
  //   }, [isOwner]);

  const { IsLogin } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f9fb]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen((isOpen) => !isOpen)} />
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pt-[62px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
