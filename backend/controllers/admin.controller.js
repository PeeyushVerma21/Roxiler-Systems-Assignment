import db from '../models/index.js';

const User = db.User;
const Store = db.Store;
const Rating = db.Rating;

// Create new user (admin/owner/user)
export const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !address || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, password, address, role });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
};

// Create store
export const createStore = async (req, res) => {
  const { name, email, address, ownerId } = req.body;

  try {
    const store = await Store.create({ name, email, address, ownerId });
    res.status(201).json({ message: 'Store added', store });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add store', error: err });
  }
};

// Get all users with optional filters
export const getUsers = async (req, res) => {
  const { name, email, address, role } = req.query;

  try {
    const where = {};
    if (name) where.name = { [db.Sequelize.Op.iLike]: `%${name}%` };
    if (email) where.email = { [db.Sequelize.Op.iLike]: `%${email}%` };
    if (address) where.address = { [db.Sequelize.Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const users = await User.findAll({ where });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Get all stores with filters
export const getStores = async (req, res) => {
  const { name, email, address } = req.query;

  try {
    const where = {};
    if (name) where.name = { [db.Sequelize.Op.iLike]: `%${name}%` };
    if (email) where.email = { [db.Sequelize.Op.iLike]: `%${email}%` };
    if (address) where.address = { [db.Sequelize.Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [{ model: Rating }],
    });

    const storesWithRatings = stores.map((store) => {
      const total = store.Ratings.length;
      const avg = total ? (store.Ratings.reduce((sum, r) => sum + r.value, 0) / total).toFixed(2) : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avg,
      };
    });

    res.json(storesWithRatings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stores', error: err.message });
  }
};

// Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const users = await User.count();
    const stores = await Store.count();
    const ratings = await Rating.count();
    res.json({ totalUsers: users, totalStores: stores, totalRatings: ratings });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};

// Get full user detail
export const getUserDetail = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let ratingInfo = null;
    if (user.role === 'owner') {
      const store = await Store.findOne({ where: { ownerId: userId }, include: [Rating] });
      if (store) {
        const ratings = store.Ratings || [];
        const total = ratings.length;
        const avg = total ? (ratings.reduce((sum, r) => sum + r.value, 0) / total).toFixed(2) : null;
        ratingInfo = { store: store.name, averageRating: avg };
      }
    }

    res.json({ user, ratingInfo });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user detail', error: err.message });
  }
};
