import { useState, Suspense, lazy } from "react";
import SidebarMenu from "../Components/Menu";
import { FaFilter, FaCalendarAlt } from "react-icons/fa";

// Lazy load components
const CreateTaskForm = lazy(() => import("../Components/Taskcreate"));
const AllTasks = lazy(() => import("../Components/Alltasks"));
const PendingTasks = lazy(() => import("../Components/Pendingtasks"));
const CompletedTasks = lazy(() => import("../Components/CompletedTasks"));
const FilteredTasks = lazy(() => import("../Components/Filtercomponent"));

const Homepage = () => {
  const [activeMenu, setActiveMenu] = useState("All Tasks");
  const [showFilter, setShowFilter] = useState(false);
  const userId = localStorage.getItem("userId");

  const renderContent = () => {
    switch (activeMenu) {
      case "All Tasks":
        return <AllTasks userId={userId} />;
      case "Create Task":
        return <CreateTaskForm />;
      case "Pending Tasks":
        return <PendingTasks />;
      case "Completed":
        return <CompletedTasks />;
      case "Calendar":
        return <CalendarView />;
      case "Logout":
        return <div>Logging out...</div>;
      default:
        return <AllTasks userId={userId} />;
    }
  };

  return (
    <div className="flex relative min-h-screen">
      {/* Sidebar */}
      <SidebarMenu onMenuChange={setActiveMenu} />

      {/* Main content */}
<div
  className="flex-1 ml-0 md:ml-72 min-h-screen pb-24 md:pb-6 w-[80vw] mt-16 md:mt-0 border border-gray-400"
>



      {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                {activeMenu}
              </h1>
              <p className="text-gray-500 text-sm">
                Manage your {activeMenu.toLowerCase()}
              </p>
            </div>
            
            <button
  onClick={() => setShowFilter(!showFilter)}
  className={`px-3 py-2 rounded-lg text-sm font-medium ${
    showFilter
      ? "bg-blue-600 text-white"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`}
>
  <FaFilter className="inline mr-1" />
  {showFilter ? "Close Filter" : "Filter"}
</button>
  </div>
        </div>

        {/* Content */}
        <div className="px-1 py-4 md:px-2">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="spinner w-8 h-8 mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Loading...</p>
              </div>
            </div>
          }>
            {showFilter ? <FilteredTasks /> : renderContent()}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

// Calendar View Component
const CalendarView = () => {
  return (
    <div className="card p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Calendar View</h3>
      <div className="text-center py-12">
        <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Calendar view coming soon...</p>
      </div>
    </div>
  );
};

export default Homepage;