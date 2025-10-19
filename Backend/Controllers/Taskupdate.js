import Task from "../Models/tasks.js";

export const updateTask = async (req, res) => {
  try {
    const { userId, taskId, title, description, dueDate, priority } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId }, 
      { title, description, dueDate, priority },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not yours' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
