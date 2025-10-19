import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    
    description: { type: String },
    
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "working", "completed"],
      default: "pending",
    },
    
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    dueDate: {
      type: Date,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usertm",
      index: true
    },
  },
  { timestamps: true }
);



taskSchema.index({ user: 1, createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;