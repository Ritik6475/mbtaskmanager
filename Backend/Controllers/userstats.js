import User from "../Models/User.js";
import Task from "../Models/tasks.js";
import mongoose from "mongoose";


export const userstats = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "UserId is required" });

    const user = await User.findById(userId).select("name");
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalTasks = await Task.countDocuments({ user: userId });
    const pending = await Task.countDocuments({ user: userId, status: "pending" });
    const working = await Task.countDocuments({ user: userId, status: "working" });
    const completed = await Task.countDocuments({ user: userId, status: "completed" });

    res.json({
      name: user.name,
      totalTasks,
      pending,
      working,
      completed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
