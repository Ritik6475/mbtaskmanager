// src/components/TaskCard.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../Redux/Slices/taskslices";


import TaskCardEdit from "./Task/TaskCardEdit";
import TaskCardSimple from "./Task/TaskCardSimple";
import TaskCardPro from "./Task/TaskCardSimple";




export default function TaskCard({ task, onUpdated, userId: propUserId }) {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const userId = propUserId || localStorage.getItem("userId");

  const handleSaveEdit = async (formData) => {
    setSaving(true);
    try {
      await dispatch(
        updateTask({ userId, taskId: task._id, formData })
      ).unwrap();
      setIsEditing(false);
      onUpdated?.(); // optional refetch
    } catch (err) {
      alert(err); // err is already the message from rejectWithValue
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === task.status) return;
    setStatusLoading(true);
    try {
      await dispatch(
        updateTaskStatus({ userId, taskId: task._id, status: newStatus })
      ).unwrap();
      onUpdated?.();
    } catch (err) {
      alert(err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task permanently?")) return;
    setDeleting(true);
    try {
      await dispatch(deleteTask({ userId, taskId: task._id })).unwrap();
      onUpdated?.();
    } catch (err) {
      alert(err);
    } finally {
      setDeleting(false);
    }
  };

  return isEditing ? (
    <TaskCardEdit
      task={task}
      onSave={handleSaveEdit}
      onCancel={() => setIsEditing(false)}
      saving={saving}
    />
  ) : (
    <TaskCardPro
      task={task}
      onEdit={() => setIsEditing(true)}
      onDelete={handleDelete}
      onStatusChange={handleStatusChange}
      statusLoading={statusLoading}
      deleting={deleting}
    />
  );
}
