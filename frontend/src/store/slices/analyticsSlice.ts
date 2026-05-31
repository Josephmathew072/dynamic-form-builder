import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { analyticsApi } from "../../services/analyticsApi"
import { Analytics } from "../../types/analytics.types"

interface AnalyticsState {
  analytics: Analytics | null
  loading: boolean
  error: string | null
}

const initialState: AnalyticsState = {
  analytics: null,
  loading: false,
  error: null,
}

export const fetchAnalytics = createAsyncThunk("analytics/fetch", async (formId: string) => {
  const response = await analyticsApi.getByFormId(formId)
  return response.data
})

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.analytics = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.analytics = action.payload
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch analytics"
      })
  },
})

export const { clearAnalytics } = analyticsSlice.actions
export default analyticsSlice.reducer