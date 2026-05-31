import { configureStore } from '@reduxjs/toolkit';
import formsReducer from './slices/formsSlice';
import responsesReducer from './slices/responsesSlice';
import analyticsReducer from './slices/analyticsSlice';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    forms: formsReducer,
    responses: responsesReducer,
    analytics: analyticsReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;