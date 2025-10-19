import Task from "../Models/tasks.js";

export const getAllTasks = async (req, res) => {
  try {
    const { userId, page, limit } = req.query;

    console.log(userId, page, limit);
    if (!userId) return res.status(400).json({ message: "UserId is required" });

    const skip = (parseInt(page) - 1) * parseInt(limit);
  
    const [tasks, totalTasks] = await Promise.all([
      Task.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        ,
      Task.countDocuments({ user: userId }),
    ]);

    console.log(tasks);
    res.status(200).json({
      tasks,
      totalTasks,
      page: parseInt(page),
      totalPages: Math.ceil(totalTasks / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getTasksByPriority = async (req, res) => {
  try {
    const { userId, priority } = req.query;
    if (!userId || !priority)
      return res
        .status(400)
        .json({ message: "UserId and priority are required" });

    const tasks = await Task.find({ user: userId, priority }).sort({
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTasksByStatus = async (req, res) => {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query;

    if (!userId || !status) {
      return res.status(400).json({ message: "UserId and status are required" });
    }

    const skip = (page - 1) * limit;
    const tasks = await Task.find({ user: userId, status })
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const totalTasks = await Task.countDocuments({ user: userId, status });

    res.status(200).json({
      tasks,
      totalTasks,
      page: Number(page),
      totalPages: Math.ceil(totalTasks / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getTasksByFilter = async (req, res) => {
  try {
    const { userId, status, priority, startDate, endDate, page = 1, limit = 10 } = req.query;
    if (!userId)
      return res.status(400).json({ message: "UserId is required" });

    const filter = { user: userId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (startDate || endDate) {
      filter.dueDate = {};
      if (startDate) filter.dueDate.$gte = new Date(startDate);
      if (endDate) filter.dueDate.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

       console.log(tasks);

    res.status(200).json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalTasks: total,

    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
