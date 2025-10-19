// src/Redux/Slices/taskManagerSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const fetchTasks = createAsyncThunk(
  "taskManager/fetchAll",
  async ({ userId, page = 1, limit = 10 }, thunkAPI) => {
    if (!userId) return thunkAPI.rejectWithValue("UserId is required");
    try {
      const res = await axios.get(`${API_URL}/tasks`, { params: { userId, page, limit } });
      return {
        tasks: res.data.tasks,
        total: res.data.totalTasks,
        page: res.data.page,
        totalPages: res.data.totalPages,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }  
);
export const fetchTasksByStatus = createAsyncThunk(
  "taskManager/fetchByStatus",
  async ({ userId, status, page = 1, limit = 10 }, thunkAPI) => {
    if (!userId) return thunkAPI.rejectWithValue("UserId is required");
    try {
      const res = await axios.get(`${API_URL}/tasks/status`, { params: { userId, status, page, limit } });

      return {
        tasks: res.data.tasks,
        total: res.data.totalTasks,       
        page: res.data.page,              
        totalPages: res.data.totalPages,  
        limit,                                 };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const fetchTasksByFilter = createAsyncThunk(
  "taskManager/fetchByFilter",
  async ({ userId, status, priority, startDate, endDate, page = 1, limit = 10 }, thunkAPI) => {
    if (!userId) return thunkAPI.rejectWithValue("UserId is required");
    try {
      const res = await axios.get(`${API_URL}/tasks/filter`, {
        params: { userId, status, priority, startDate, endDate, page, limit },
      });
      return {
        tasks: res.data.tasks,
        total: res.data.total,
        page,
        limit,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState = {
  tasks: [],
  total: 0,
  page: 1,
  totalPages: 1,
  limit: 10,
  loading: false,
  error: null,
};


const taskManagerSlice = createSlice({
  name: "taskManager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
  state.loading = false;
  const { tasks, page, limit, total } = action.payload;

  state.tasks = tasks; 
  state.total = total || tasks.length;
  state.page = page;
  state.limit = limit;
})    .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTasksByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     
     .addCase(fetchTasksByStatus.fulfilled, (state, action) => {
  state.loading = false;
  const { tasks, page, limit, total, totalPages } = action.payload;

  state.tasks = tasks;          
  state.total = total;     
  state.page = page;            
  state.limit = limit;          
  state.totalPages = totalPages;
})
   .addCase(fetchTasksByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTasksByFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByFilter.fulfilled, (state, action) => {
        state.loading = false;
        const { tasks, page, limit, total } = action.payload;
        state.tasks = page > 1 ? [...state.tasks, ...tasks] : tasks;
        state.total = total || state.tasks.length;
        state.page = page;
        state.limit = limit;
      })
      .addCase(fetchTasksByFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default taskManagerSlice.reducer;
