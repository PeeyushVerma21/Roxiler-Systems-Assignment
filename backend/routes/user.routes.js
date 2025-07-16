import express from 'express';
import authenticate from '../middlewares/auth.js';
import allowRoles from '../middlewares/roles.js';

import { getAllStores, rateStore } from '../controllers/user.controller.js';

const router = express.Router();

router.use(authenticate, allowRoles('user'));

router.get('/stores', getAllStores); // Search & list stores
router.post('/rate/:storeId', rateStore); // Submit/update rating

export default router;
