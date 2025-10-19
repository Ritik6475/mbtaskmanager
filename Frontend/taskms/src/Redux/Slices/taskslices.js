import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// 1. Fetch all tasks
// 4. Create task
export const createTask = createAsyncThunk(
  "tasks/create",
  async ({ userId, formData }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API_URL}/createtask`,
        { ...formData, userId, status: "pending" },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 5. Update task
export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ userId, taskId, formData }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/updatetask`, {
        userId,
        taskId,
        ...formData,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 6. Update status
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ userId, taskId, status }, thunkAPI) => {
    try {
      const res = await axios.put(`${API_URL}/updatestatus`, {
        userId,
        taskId,
        status,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// 7. Delete task
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async ({ userId, taskId }, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/deletetask`, {
        data: { userId, taskId },
      });
      return { taskId };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
 
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })

      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload.taskId);
      });
  },
});

export default tasksSlice.reducer;
