import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authslices.js';
import taskStatsReducer from './Slices/userStatsSlice.js';  
import  taskManagerSlice  from './Slices/taskmanagerslice.js';
import tasksReducer from './Slices/taskslices.js';

const store = configureStore({
  reducer: {
       auth: authReducer,
      taskStats: taskStatsReducer,
      taskManager:taskManagerSlice,
       tasks: tasksReducer,
    },
});

export default store;
