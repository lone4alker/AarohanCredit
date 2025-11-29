import express from 'express';
import { startSync } from '../controller/syncController.js';

const router = express.Router();

router.post('/start', startSync);

export default router;
