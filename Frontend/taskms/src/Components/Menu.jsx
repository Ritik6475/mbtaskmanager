import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaSignOutAlt,
  FaPlus,
  FaCalendarAlt,
  FaBars,
  FaTimes,
  FaUser 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";


export default function SidebarMenu({ onMenuChange }) {
  const navigate = useNavigate();

  const { stats: taskStats, name, loading: statsLoading, error: statsError } = useSelector(
  (state) => state.taskStats
);


  const menus = [
    { name: "All Tasks", icon: <FaTasks />, color: "from-indigo-500 to-indigo-600" },
    { name: "Pending Tasks", icon: <FaClock />, color: "from-amber-500 to-amber-600" },
    { name: "Completed", icon: <FaCheckCircle />, color: "from-green-500 to-green-600" },
    { name: "Calendar", icon: <FaCalendarAlt />, color: "from-purple-500 to-purple-600" },
    { name: "Logout", icon: <FaSignOutAlt />, color: "from-red-500 to-red-600" },
  ];

  const [active, setActive] = useState("All Tasks");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (menuName) => {
    if (menuName === "Logout") {
      localStorage.removeItem("userId");
      localStorage.removeItem("userid");
      navigate("/login");
      return;
    }
    setActive(menuName);
    onMenuChange(menuName);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <FaTimes className="text-gray-600" /> : <FaBars className="text-gray-600" />}
              </button>
              <h1 className="text-xl font-bold gradient-text">TaskManager</h1>
            </div>
            <button
              onClick={() => handleClick("Create Task")}
              className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <FaPlus className="text-lg" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col py-8 shadow-2xl border-r border-slate-700 z-40"
        >
          {/* Logo */}
          <div className="px-6 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaTasks className="text-white text-lg" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">TaskManager</h1>
            </motion.div>
          </div>

          {/* Create Task Button */}
          <div className="px-6 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleClick("Create Task")}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FaPlus />
              Create Task
            </motion.button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 px-4">
            <ul className="space-y-2">
              {menus.map((menu, index) => (
                <motion.li
                  key={menu.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <button
                    onClick={() => handleClick(menu.name)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      active === menu.name
                        ? `bg-gradient-to-r ${menu.color} text-white shadow-lg transform scale-105`
                        : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
                    }`}
                  >
                    <span className="text-xl">{menu.icon}</span>
                    <span className="font-medium">{menu.name}</span>
                    {active === menu.name && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* User Info */}
          <div className="px-6 pt-6 border-t border-slate-700">
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Welcome back! {name||"User"}</p>
                <p className="text-xs text-slate-400">Ready to be productive?</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mobile Sidebar */}
     {/* Mobile Sidebar */}
{isMobile && (
  <motion.div
    initial={false}
    animate={{ x: sidebarOpen ? 0 : "-100%" }}  // slide in/out from left
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="fixed top-0 left-0 bottom-0 w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-50 shadow-2xl"
  >
    {/* Mobile Header */}
    <div className="px-6 py-4 border-b border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <FaTasks className="text-white text-sm" />
          </div>
          <h1 className="text-lg font-bold">TaskManager</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <FaTimes />
        </button>
      </div>
    </div>

    {/* Mobile Menu Items */}
    <div className="px-1 py-6">
      <ul className="space-y-2">
        {menus.map((menu) => (
          <li key={menu.name}>
            <button
              onClick={() => handleClick(menu.name)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                active === menu.name
                  ? `bg-gradient-to-r ${menu.color} text-white shadow-lg`
                  : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
              }`}
            >
              <span className="text-lg">{menu.icon}</span>
              <span className="font-medium">{menu.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
)}

      {/* Bottom Navigation for Mobile */}
      {/* Bottom Navigation for Mobile */}
{/* Bottom Navigation for Mobile */}
{isMobile && (
  <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 z-50">
    <div className="flex justify-around py-2">
      {menus.slice(0, 4).map((menu) => (
        <button
          key={menu.name}
          onClick={() => handleClick(menu.name)}
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 ${
            active === menu.name
              ? "text-blue-600 bg-blue-50 scale-110"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span className="text-lg mb-1">{menu.icon}</span>
          <span className="text-xs font-medium">{menu.name.split(" ")[0]}</span>
        </button>
      ))}
    </div>
  </div>
)}
    </>
  );
}