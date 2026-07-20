import { Router } from 'express';
import { analyzeRequest } from '../controllers/aiController';

const router = Router();

router.post('/analyze-request', analyzeRequest);

export default router;
