import express from 'express';
import { 
  submitResponse, 
  getResponsesByFormId,
  updateResponse,
  deleteResponse
} from '../controllers/responseController.js';

const router = express.Router();

router.post('/', submitResponse);
router.get('/form/:formId', getResponsesByFormId);
router.put('/:id', updateResponse);
router.delete('/:id', deleteResponse);

export default router;