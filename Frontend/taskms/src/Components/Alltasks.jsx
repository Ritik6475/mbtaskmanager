import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import TaskCard from "./TaskCard";
import { FaSearch, FaPlus } from "react-icons/fa";
import { fetchUserStats } from "../Redux/Slices/userStatsSlice";
import { fetchTasks } from "../Redux/Slices/taskmanagerslice";

export default function AllTasks() {
  const dispatch = useDispatch();

  const { stats: taskStats, loading: statsLoading, error: statsError } = useSelector(
    (state) => state.taskStats
  );

  const { tasks = [], total = 0, page: currentPage = 1, loading: tasksLoading, error: tasksError } =
    useSelector((state) => state.taskManager); // redux-managed tasks

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [filterStatus, setFilterStatus] = useState("all");

  const limit = 10;
  
  const userId = (localStorage.getItem("userId") || "").trim();

  // Fetch stats via slice
  useEffect(() => {
    if (userId) dispatch(fetchUserStats(userId));
  }, [userId, dispatch]);

  // Fetch paginated tasks via slice
  useEffect(() => {
    if (userId) dispatch(fetchTasks({ userId, page: currentPage, limit }));
  }, [userId, currentPage, limit, dispatch]);


  // Filter + sort locally
  const filteredTasks = tasks
    .filter((task) => {
      const search = searchTerm.toLowerCase();
      const title = (task.title || "").toLowerCase();
      const desc = (task.description || "").toLowerCase();
      const matchesSearch = title.includes(search) || desc.includes(search);
      const matchesStatus = filterStatus === "all" || task.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "dueDate":
          return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
        case "createdAt":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  if (tasksLoading || statsLoading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );

  if (tasksError || statsError)
    return (
      <div className="text-center py-20">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Tasks</h3>
          <p className="text-red-600">{tasksError || statsError}</p>
        </div>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-gray-900">{taskStats.total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-700">{taskStats.pending}</div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-700">{taskStats.working}</div>
          <div className="text-sm text-blue-600">Working</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-700">{taskStats.completed}</div>
          <div className="text-sm text-green-600">Completed</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="working">Working</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="createdAt">Newest First</option>
            <option value="title">Title A-Z</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      {!filteredTasks.length ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm || filterStatus !== "all" ? "No matching tasks" : "No tasks yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first task to get started with productivity"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button className="btn-primary flex items-center gap-2 mx-auto">
                <FaPlus /> Create First Task
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                userId={userId}
                onUpdated={() => dispatch(fetchTasks({ userId, page: currentPage, limit }))} // refresh via redux
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              disabled={currentPage <= 1}
              onClick={() => dispatch(fetchTasks({ userId, page: currentPage - 1, limit }))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 border rounded">
              Page {currentPage} of {Math.ceil(total / limit)}
            </span>
            <button
              disabled={currentPage >= Math.ceil(total / limit)}
              onClick={() => dispatch(fetchTasks({ userId, page: currentPage + 1, limit }))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
