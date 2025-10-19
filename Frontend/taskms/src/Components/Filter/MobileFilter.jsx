// src/components/filters/MobileFilter.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter, FaTimes, FaCalendarAlt, FaCheck, FaFlag, FaClock } from "react-icons/fa";

export default function MobileFilter({
  status,
  setStatus,
  priority,
  setPriority,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onApply,
  onClear,
}) {
  const [showFilters, setShowFilters] = useState(false);

  // Status options with icons
  const statusOptions = [
    { value: "", label: "All", icon: <FaClock className="text-gray-500" /> },
    { value: "pending", label: "Pending", icon: <FaClock className="text-yellow-500" /> },
    { value: "working", label: "Working", icon: <FaClock className="text-blue-500" /> },
    { value: "completed", label: "Completed", icon: <FaCheck className="text-green-500" /> },
  ];

  // Priority options with colors
  const priorityOptions = [
    { value: "", label: "All", color: "bg-gray-200 text-gray-800" },
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "High", color: "bg-red-100 text-red-800" },
  ];

  // Count active filters
  const activeFilters = [status, priority, startDate, endDate].filter(Boolean).length;

  return (
    <>
      {/* Top Filter Bar - Always Visible */}
      <div className="w-full bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
        <button
          onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 bg-gray-800 text-white py-2 px-4 rounded font-medium hover:bg-gray-700 transition-colors"
        >
          <FaFilter />
          Filters
          {activeFilters > 0 && (
              <span className="bg-white text-gray-800 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

        {/* Quick Filter Row */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex-shrink-0 bg-gray-50 text-sm rounded px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="working">Working</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="flex-shrink-0 bg-gray-50 text-sm rounded px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          
          <button
            onClick={onApply}
            className="flex-shrink-0 bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Apply
          </button>
          
          <button
            onClick={onClear}
            className="flex-shrink-0 bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowFilters(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-50 shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gray-800 p-4 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FaFilter />
                    Advanced Filters
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
              
              {/* Filter Content */}
              <div className="overflow-y-auto p-4 space-y-4">
                {/* Date Range Filter */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Date Range</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-3 bg-gray-50 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => {
                    onClear();
                    setShowFilters(false);
                  }}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded font-medium hover:bg-gray-200 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    onApply();
                    setShowFilters(false);
                  }}
                  className="flex-1 py-3 px-4 bg-gray-800 text-white rounded font-medium hover:bg-gray-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}