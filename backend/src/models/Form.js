import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['text', 'number', 'select', 'radio', 'textarea', 'date', 'checkbox'], 
    required: true 
  },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  placeholder: { type: String },
  options: { type: [String], default: [] }, // For select and radio
  multiple: { type: Boolean, default: false }, // For select only
  defaultValue: { type: mongoose.Schema.Types.Mixed, default: null }, // For checkbox/radio
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fields: [fieldSchema],
  shareableId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Form', formSchema);