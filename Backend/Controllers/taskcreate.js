
import User from "../Models/User.js";
import Task from "../Models/tasks.js";

// POST /createtask
export const createTask = async (req, res) => {
  try {
    
    const { title, description, priority, dueDate, userId } = req.body;
    console.log(title, description, priority, dueDate, userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      user: userId,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { tasks: task._id },
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};
