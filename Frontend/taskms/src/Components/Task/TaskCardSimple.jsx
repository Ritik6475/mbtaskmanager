import { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaFlag,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
// ...existing code...

export default function TaskCardPro({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  statusLoading,
  deleting,
}) {
  const [showDetails, setShowDetails] = useState(false);

  const statusStyle = {
    completed:
      "bg-gradient-to-r from-green-800 to-emerald-700 text-white border-green-800",
    working: "bg-gradient-to-r from-sky-800 to-blue-700 text-white border-sky-800",
    pending:
      "bg-gradient-to-r from-amber-800 to-yellow-700 text-white border-amber-800",
  };

  const priorityStyle = {
    high: "bg-gradient-to-r from-red-300/80 to-rose-200/40 text-red-700 border-red-300",
    medium:
      "bg-gradient-to-r from-orange-200/80 to-amber-100/40 text-amber-700 border-amber-300",
    low: "bg-gradient-to-r from-emerald-200/80 to-green-100/60 text-emerald-700 border-emerald-200",
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null;

  const isOverdue =
    task?.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed";

  const id = task?._1d || task?._id || task?.id;

  const initials = (task?.title || "T")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Compact darker status chip mapping (filled look)
  const statusChip = {
    completed: "bg-emerald-800 text-white",
    working: "bg-sky-800 text-white",
    pending: "bg-amber-800 text-white",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.28 }}
      className="relative rounded-xl overflow-hidden bg-white/70 backdrop-blur-sm border border-slate-100"
      aria-labelledby={`task-title-${id}`}
    >
      {/* Left accent stripe */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${task?.priority === "high" ? "bg-red-500" : task?.priority === "medium" ? "bg-amber-400" : "bg-emerald-400"}`}
        aria-hidden
      />

      <div className="p-4 pl-5 flex flex-col gap-2">
        <div className="flex items-start gap-3">
          {/* Avatar / Icon */}
          <div className="flex-none">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center text-indigo-700 font-semibold shadow-sm">
              {initials}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <h3 id={`task-title-${id}`} className="text-md font-semibold text-slate-900 truncate">
                {task?.title}
              </h3>

              <div className="ml-auto flex items-center gap-2">
                {task?.status === "completed" && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-800 text-white">
                    <FaCheckCircle /> Done
                  </span>
                )}
                {isOverdue && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-700 text-white">
                    <FaExclamationTriangle /> Overdue
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-500 mt-1 truncate">{task?.description || "No description"}</p>

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${priorityStyle[task?.priority || "low"]}`}>
                <FaFlag className="text-xs" />
                {task?.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : "Low"}
              </span>

              {task?.dueDate && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-100 bg-slate-700 px-2 py-1 rounded-full">
                  <FaCalendarAlt className="text-sm text-slate-200" />
                  {formatDate(task.dueDate)}
                </span>
              )}

              {task?.createdAt && (
                <span className="text-xs text-slate-400 ml-auto sm:ml-0">
                  <span className="font-mono">{formatDate(task.createdAt)}</span>
                </span>
              )}
            </div>

            {/* Compact filled status + actions (progress bar removed) */}
            <div className="mt-3 flex items-center gap-3">
              <div className={`flex-none text-xs font-semibold px-3 py-1 rounded-full ${statusChip[task?.status || "pending"]}`}>
                {task?.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : "Pending"}
              </div>

              <div className="flex-1" />

              <div className="flex-none flex items-center gap-2">
                <select
                  value={task?.status}
                  onChange={(e) => onStatusChange(e.target.value)}
                  disabled={statusLoading}
                  className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white shadow-sm transition"
                  aria-label="Change status"
                >
                  <option value="pending">Pending</option>
                  <option value="working">Working</option>
                  <option value="completed">Completed</option>
                </select>

                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onEdit}
                  className="p-2 text-sky-600 hover:text-sky-800 rounded-md hover:bg-sky-50 transition"
                  title="Edit task"
                >
                  <FaEdit />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onDelete}
                  disabled={deleting}
                  className="p-2 text-rose-600 hover:text-rose-800 rounded-md hover:bg-rose-50 disabled:opacity-50 transition"
                  title="Delete task"
                >
                  <FaTrash />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              key="details"
              id={`details-${id}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.26, ease: "easeInOut" }}
              className="pt-3 border-t border-slate-100"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                    Details
                  </h4>
                  <div className="text-sm text-slate-600 bg-indigo-50/40 p-3 rounded-lg">
                    {task?.description || "No description provided."}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-2 flex items-center justify-between">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-cyan-700 hover:text-cyan-900 inline-flex items-center gap-2 font-medium"
            aria-expanded={showDetails}
          >
            {showDetails ? "Hide details" : "Show details"}
            {showDetails ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          <div className="text-xs text-slate-400">
            <span className="hidden sm:inline">ID: </span>
            <span className="font-mono">{String(id).slice(0, 8)}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}