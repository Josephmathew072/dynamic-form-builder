import Response from '../models/Response.js';
import Form from '../models/Form.js';
import { validateResponse } from '../middleware/validateResponse.js';

// @desc    Submit a response
// @route   POST /api/responses
export const submitResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body;
    
    // Validate form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    // Validate answers against form schema
    const validation = validateResponse(form, answers);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    const response = await Response.create({
      formId,
      answers,
      submittedAt: new Date()
    });
    
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get responses for a form
// @route   GET /api/responses/form/:formId
export const getResponsesByFormId = async (req, res) => {
  try {
    const responses = await Response.find({ formId: req.params.formId })
      .sort({ submittedAt: -1 });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a response
// @route   PUT /api/responses/:id
export const updateResponse = async (req, res) => {
  try {
    const { answers } = req.body;
    const response = await Response.findById(req.params.id);
    
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }
    
    // Validate answers against form schema
    const form = await Form.findById(response.formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    const validation = validateResponse(form, answers);
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    response.answers = answers;
    const updatedResponse = await response.save();
    res.json(updatedResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a response
// @route   DELETE /api/responses/:id
export const deleteResponse = async (req, res) => {
  try {
    const response = await Response.findById(req.params.id);
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }
    
    await response.deleteOne();
    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};