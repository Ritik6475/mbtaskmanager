import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import TaskCard from "./TaskCard";
import { fetchTasksByStatus } from "../Redux/Slices/taskManagerSlice";

const CompletedTasks = () => {
  const dispatch = useDispatch();
  const { tasks, total, page: currentPage, totalPages, totalTasks,limit, loading, error } =
    useSelector((state) => state.taskManager);

  const [page, setPage] = useState(1);
  const userId = (localStorage.getItem("userId") || "").trim();
  const pageLimit = 5;

  // Fetch completed tasks via thunk
  useEffect(() => {
    if (userId) {
      dispatch(
        fetchTasksByStatus({
          userId,
          status: "completed",
          page,
          limit: pageLimit,
        })
      );
    }
  }, [userId, page, dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-gray-500 animate-pulse">Loading tasks...</span>
      </div>
    );

  if (error)
    return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaCheckCircle className="text-green-600" /> Completed Tasks {total||4}
      </h2>

      {!tasks.length ? (
        <p className="text-gray-500">No completed tasks yet.</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdated={() =>
                dispatch(
                  fetchTasksByStatus({
                    userId,
                    status: "completed",
                    page,
                    limit: pageLimit,
                  })
                )
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
      )}
    </div>
  );
};

export default CompletedTasks;
