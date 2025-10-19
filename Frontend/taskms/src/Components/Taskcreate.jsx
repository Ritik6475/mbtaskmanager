import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPlus,
  FaFlag,
  FaTimes,
  FaCalendarAlt,
  FaStickyNote,
  FaHeading,
  FaCheck,
} from "react-icons/fa";

import { createTask } from "../Redux/Slices/taskslices";

export default function CreateTaskForm() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.tasks); // optional
  
  const userId = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await dispatch(createTask({ userId, formData })).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
      });
    } catch (err) {
      setError(err || "Failed to create task");
    }
  };

  const priorityOptions = [
    {
      value: "low",
      label: "Low",
      color: "bg-green-100 text-green-800",
      icon: <FaFlag className="text-green-500" />,
    },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800",
      icon: <FaFlag className="text-yellow-500" />,
    },
    {
      value: "high",
      label: "High",
      color: "bg-red-100 text-red-800",
      icon: <FaFlag className="text-red-500" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-screen mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <FaPlus className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create New Task</h2>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaHeading className="text-gray-500" />
                Task Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="What needs to be done?"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaStickyNote className="text-gray-500" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Add details..."
              ></textarea>
            </div>

            {/* Priority + Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaFlag className="text-gray-500" />
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, priority: option.value })
                      }
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                        formData.priority === option.value
                          ? `${option.color} border-current scale-105`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {option.icon}
                      <span className="text-xs font-medium mt-1">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-500" />
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                  {formData.dueDate && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, dueDate: "" })
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Create Task
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="bg-green-500 text-white p-4 rounded-full shadow-lg"
          >
            <FaCheck className="text-3xl" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
