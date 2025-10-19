// src/components/TaskCardView.jsx
import { motion } from "framer-motion";
import { FaTrashAlt, FaEdit, FaExchangeAlt, FaClock, FaCalendarAlt, FaFlag, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

const PRIORITY_COLORS = {
  high: { bg: "from-red-500 to-rose-600", text: "text-red-600", icon: <FaExclamationTriangle className="text-red-500" /> },
  medium: { bg: "from-amber-400 to-orange-500", text: "text-amber-600", icon: <FaExclamationTriangle className="text-amber-500" /> },
  low: { bg: "from-emerald-400 to-teal-500", text: "text-emerald-600", icon: <FaInfoCircle className="text-emerald-500" /> },
};

const STATUS_COLORS = {
  pending: { bg: "bg-gray-100", text: "text-gray-800", icon: <FaClock className="text-gray-500" /> },
  working: { bg: "bg-blue-100", text: "text-blue-800", icon: <FaExchangeAlt className="text-blue-500" /> },
  completed: { bg: "bg-green-100", text: "text-green-800", icon: <FaCheckCircle className="text-green-500" /> },
};

export default function TaskCardView({ task, onEdit, onDelete, onStatusChange, statusLoading, deleting }) {
  const formattedCreated = task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "—";
  const formattedDue = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;
  
  const priority = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;
  const status = STATUS_COLORS[task.status] || STATUS_COLORS.pending;

  return (
    
    <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeOut" }}
  // 👇 full width on mobile, auto on md+
  className="w-full md:w-auto p-0 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 mx-auto"
 >


      <div className={`h-2 bg-gradient-to-r ${priority.bg}`}></div>
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 truncate">{task.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
              {task.description || <span className="text-gray-400 italic">No description</span>}
            </p>
            <div className="flex flex-wrap gap-0 mb-1">
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${status.bg} ${status.text}`}>
                {status.icon}
                <span className="text-xs font-medium capitalize">{task.status}</span>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-50 ${priority.text}`}>
                <FaFlag className="text-xs" />
                <span className="text-xs font-medium capitalize">{task.priority}</span>
              </div>
              {formattedDue && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-50 text-gray-600">
                  <FaCalendarAlt className="text-xs" />
                  <span className="text-xs font-medium">{formattedDue}</span>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <FaClock /> Created: {formattedCreated}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex flex-col gap-2">
            <div className="relative group">
              <select
                value={task.status}
                onChange={(e) => onStatusChange(e.target.value)}
                disabled={statusLoading}
                className="appearance-none bg-white text-sm rounded-lg px-3 py-2 shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full cursor-pointer"
                title="Change status"
              >
                <option value="pending">Pending</option>
                <option value="working">Working</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={onEdit} title="Edit"
                className="flex-1 flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-all duration-200 text-sm font-medium">
                <FaEdit className="text-xs" /> Edit
              </button>
              <button onClick={onDelete} disabled={deleting} title="Delete"
                className={`flex-1 flex items-center justify-center gap-1 p-2 rounded-lg transition-all duration-200 text-sm font-medium ${deleting ? "bg-gray-100 text-gray-400" : "bg-red-50 text-red-600 hover:bg-red-100"}`}>
                <FaTrashAlt className="text-xs" /> Delete
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
