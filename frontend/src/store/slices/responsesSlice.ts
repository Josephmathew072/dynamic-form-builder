import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { responseApi } from "../../services/responseApi"
import { Response, ResponseInput } from "../../types/response.types"

interface ResponsesState {
  responses: Response[]
  loading: boolean
  error: string | null
}

const initialState: ResponsesState = {
  responses: [],
  loading: false,
  error: null,
}

export const fetchResponses = createAsyncThunk("responses/fetch", async (formId: string) => {
  const response = await responseApi.getByFormId(formId)
  return response.data
})

export const submitResponse = createAsyncThunk("responses/submit", async (data: ResponseInput) => {
  const response = await responseApi.submit(data)
  return response.data
})

export const updateResponse = createAsyncThunk(
  'responses/update',
  async ({ id, answers }: { id: string; answers: Record<string, any> }) => {
    const response = await responseApi.update(id, answers)
    return response.data
  }
)

export const deleteResponse = createAsyncThunk(
  'responses/delete',
  async (id: string) => {
    await responseApi.delete(id)
    return id
  }
)

const responsesSlice = createSlice({
  name: "responses",
  initialState,
  reducers: {
    clearResponses: (state) => {
      state.responses = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResponses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchResponses.fulfilled, (state, action) => {
        state.loading = false
        state.responses = action.payload
      })
      .addCase(fetchResponses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch responses"
      })
      .addCase(submitResponse.pending, (state) => {
        state.loading = true
      })
      .addCase(submitResponse.fulfilled, (state, action) => {
        state.loading = false
        state.responses.unshift(action.payload)
      })
      .addCase(submitResponse.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Submission failed"
      })
      .addCase(updateResponse.fulfilled, (state, action) => {
        state.loading = false
        const index = state.responses.findIndex(r => r._id === action.payload._id)
        if (index !== -1) {
            state.responses[index] = action.payload
        }
      })
      .addCase(deleteResponse.fulfilled, (state, action) => {
        state.loading = false
        state.responses = state.responses.filter(r => r._id !== action.payload)
      })
  },
})

export const { clearResponses } = responsesSlice.actions
export default responsesSlice.reducer