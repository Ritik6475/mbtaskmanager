// src/redux/slices/taskStatsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Async thunk to fetch user stats
export const fetchUserStats = createAsyncThunk(
  "taskStats/fetchUserStats",
  async (userId, thunkAPI) => {
    if (!userId) return thunkAPI.rejectWithValue("UserId is required");
  
    try {
      const res = await axios.get(`${API_URL}/userstats`, { params: { userId } });
      return {
        name: res.data.name || "",   // Save the user's name
        total: res.data.totalTasks,
        pending: res.data.pending,
        working: res.data.working,
        completed: res.data.completed,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const taskStatsSlice = createSlice({
  name: "taskStats",
  initialState: {
    stats: { total: 0, pending: 0, working: 0, completed: 0 },
    name: "",       // Store user name here
    loading: false,
    error: "",
  },
  reducers: {
    resetStats: (state) => {
      state.stats = { total: 0, pending: 0, working: 0, completed: 0 };
      state.name = "";
      state.error = "";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          total: action.payload.total,
          pending: action.payload.pending,
          working: action.payload.working,
          completed: action.payload.completed,
        };
        state.name = action.payload.name; // Save the name
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch stats";
      });
  },
});

export const { resetStats } = taskStatsSlice.actions;
export default taskStatsSlice.reducer;
