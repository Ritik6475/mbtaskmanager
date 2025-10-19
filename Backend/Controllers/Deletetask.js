import Task from "../Models/tasks.js";

export const deleteTask = async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not yours' });
    }

    res.json({ message: 'Task deleted successfully', taskId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
