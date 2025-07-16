import express from 'express';
import authenticate from '../middlewares/auth.js';
import allowRoles from '../middlewares/roles.js';

import {
  createUser,
  createStore,
  getUsers,
  getStores,
  getDashboardStats,
  getUserDetail,
} from '../controllers/admin.controller.js';

const router = express.Router();

// All routes require Admin login
router.use(authenticate, allowRoles('admin'));

router.post('/add-user', createUser);
router.post('/add-store', createStore);

router.get('/users', getUsers);
router.get('/stores', getStores);

router.get('/dashboard', getDashboardStats);
router.get('/user/:id', getUserDetail);

export default router;
