import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TaskCard from "./TaskCard";
import { fetchTasksByStatus } from "../Redux/Slices/taskmanagerslice";

const PendingTasks = () => {
  const dispatch = useDispatch();
  const { tasks, total, page: currentPage, totalPages, limit, loading, error } = useSelector(
    (state) => state.taskManager
  );

  const [page, setPage] = useState(1);
  const userId = (localStorage.getItem("userId") || "").trim();
  const pageLimit = 5;

  // Fetch pending tasks via thunk
  useEffect(() => {
    if (userId) {
      dispatch(fetchTasksByStatus({ userId, status: "pending", page, limit: pageLimit }));
    }
  }, [userId, page, dispatch]);

  if (loading)
    return <p className="text-gray-600 py-10 text-center">Loading pending tasks...</p>;

  if (error)
    return <p className="text-red-600 py-10 text-center">Error: {error}</p>;

  if (!tasks.length)
    return <p className="text-gray-600 py-10 text-center">No pending tasks found</p>;

  return (
    <div className="space-y-3">
      <div className="flex justify-center mt-6">
  <h5 className="text-lg font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-full shadow-sm">
    Total Pending <span className="text-blue-600">{total}</span>
  </h5>
</div>
 
     
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          userId={userId}
          onUpdated={() =>
            dispatch(fetchTasksByStatus({ userId, status: "pending", page, limit: pageLimit }))
          }
        />
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
  );
};

export default PendingTasks;
