import { useState, useEffect } from "react";
import axios from "axios";
import PCFilter from "./Filter/PCFilter";
import MobileFilter from "./Filter/MobileFilter";
import TaskCard from "./TaskCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function FilteredTasks() {
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userId = (localStorage.getItem("userId") || "").trim();
  const limit = 5;

  const fetchTasks = async (page = 1) => {
    if (!userId) {
      setError("UserId is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_URL}/api/tasks/filter`, {
        params: { userId, status, priority, startDate, endDate, page, limit },
      });

      setTasks(res.data.tasks);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setStatus("");
    setPriority("");
    setStartDate("");
    setEndDate("");
    fetchTasks(1);
  };

  useEffect(() => {
    fetchTasks(page);
  }, [page]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      {!isMobile ? (
        <PCFilter
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onApply={() => fetchTasks(1)}
          onClear={clearFilters}
        />
      ) : (
        <MobileFilter
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onApply={() => fetchTasks(1)}
          onClear={clearFilters}
        />
      )}

      <div className="p-4">
        {loading && <div className="text-center py-20">Loading…</div>}
        {error && <div className="text-center py-20 text-red-500">{error}</div>}
        {!loading && !tasks.length && (
          <div className="text-center py-20">No tasks match these filters</div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onUpdated={() => fetchTasks(page)} />
            ))}

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Prev
              </button>
              <span className="text-sm font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
