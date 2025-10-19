// src/components/filters/PCFilter.jsx
export default function PCFilter({
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
  return (
    <div className="w-full bg-white border-b border-gray-200 p-4">
      <div className="flex flex-wrap items-end gap-4">
        {/* Status */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-50 text-sm rounded px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="working">Working</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-gray-50 text-sm rounded px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-50 text-sm rounded px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-50 text-sm rounded px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={onClear}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
