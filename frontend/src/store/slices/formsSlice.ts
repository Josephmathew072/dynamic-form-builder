import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { formApi } from '../../services/formApi'
import { Form } from '../../types/form.types'

interface FormsState {
  forms: Form[]
  currentForm: Form | null
  loading: boolean
  error: string | null
}

const initialState: FormsState = {
  forms: [],
  currentForm: null,
  loading: false,
  error: null,
}

export const fetchForms = createAsyncThunk('forms/fetchForms', async () => {
  const response = await formApi.getAll()
  return response.data
})

export const fetchFormById = createAsyncThunk('forms/fetchFormById', async (id: string) => {
  const response = await formApi.getById(id)
  return response.data
})

export const fetchFormByShareableId = createAsyncThunk('forms/fetchFormByShareableId', async (shareableId: string) => {
  const response = await formApi.getByShareableId(shareableId)
  return response.data
})

export const createForm = createAsyncThunk('forms/createForm', async (formData: Partial<Form>) => {
//   console.log("Creating form with data:", formData)
  const response = await formApi.create(formData)
  return response.data
})

export const updateForm = createAsyncThunk(
  'forms/updateForm',
  async ({ id, data }: { id: string; data: Partial<Form> }) => {
    const response = await formApi.update(id, data)
    return response.data
  }
)

export const deleteForm = createAsyncThunk(
  'forms/deleteForm',
  async (id: string) => {
    await formApi.delete(id)
    return id
  }
)

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    clearCurrentForm: (state) => {
      state.currentForm = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        // console.log("FORMS STATE:", state.forms)
        state.loading = false
        state.forms = Array.isArray(action.payload) ? action.payload : []
    })
      .addCase(fetchForms.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch forms'
      })
      .addCase(fetchFormById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFormById.fulfilled, (state, action) => {
        state.loading = false
        state.currentForm = action.payload
      })
      .addCase(fetchFormById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch form'
      })
      .addCase(fetchFormByShareableId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFormByShareableId.fulfilled, (state, action) => {
        state.loading = false
        state.currentForm = action.payload
      })
      .addCase(fetchFormByShareableId.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Form not found'
      })
      .addCase(createForm.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.loading = false
        state.forms.unshift(action.payload)
      })
      .addCase(createForm.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create form'
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        state.loading = false
        const index = state.forms.findIndex(f => f._id === action.payload._id)
        if (index !== -1) {
            state.forms[index] = action.payload
        }
        if (state.currentForm?._id === action.payload._id) {
            state.currentForm = action.payload
        }
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.loading = false
        state.forms = state.forms.filter(f => f._id !== action.payload)
        if (state.currentForm?._id === action.payload) {
            state.currentForm = null
        }
      })
  }
})

export const { clearCurrentForm, clearError } = formsSlice.actions
export default formsSlice.reducer