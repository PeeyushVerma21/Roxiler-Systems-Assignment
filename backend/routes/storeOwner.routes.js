import express from 'express';
import authenticate from '../middlewares/auth.js';
import allowRoles from '../middlewares/roles.js';

import { getStoreRatings } from '../controllers/storeOwner.controller.js';

const router = express.Router();

router.use(authenticate, allowRoles('owner'));

router.get('/dashboard', getStoreRatings); // Dashboard for store owner

export default router;
