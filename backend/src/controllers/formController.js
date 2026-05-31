import Form from '../models/Form.js';
import Response from '../models/Response.js';
import ShortUniqueId from 'short-unique-id';


const uid = new ShortUniqueId({ length: 8 });

// @desc    Create a new form
// @route   POST /api/forms
export const createForm = async (req, res) => {
  try {
    const { title, description, fields } = req.body;
    
    const shareableId = uid.rnd();
    
    const form = await Form.create({
      title,
      description,
      fields,
      shareableId
    });
    
    res.status(201).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all forms
// @route   GET /api/forms
export const getForms = async (req, res) => {
  try {
    // console.log("Fetching all forms...")
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get form by ID
// @route   GET /api/forms/:id
export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get form by shareable ID
// @route   GET /api/forms/share/:shareableId
export const getFormByShareableId = async (req, res) => {
  try {
    const form = await Form.findOne({ shareableId: req.params.shareableId });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a form
// @route   PUT /api/forms/:id
export const updateForm = async (req, res) => {
  try {
    const { title, description, fields } = req.body;
    const form = await Form.findById(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    form.title = title || form.title;
    form.description = description;
    form.fields = fields || form.fields;
    
    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a form
// @route   DELETE /api/forms/:id
export const deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    // Delete all responses for this form as well
    await Response.deleteMany({ formId: req.params.id });
    await form.deleteOne();
    
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};