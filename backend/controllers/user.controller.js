import db from '../models/index.js';

const Store = db.Store;
const Rating = db.Rating;

// List all stores with optional search
export const getAllStores = async (req, res) => {
  const { name, address } = req.query;

  try {
    const where = {};
    if (name) where.name = { [db.Sequelize.Op.iLike]: `%${name}%` };
    if (address) where.address = { [db.Sequelize.Op.iLike]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
        },
      ],
    });

    const results = stores.map((store) => {
      const totalRatings = store.Ratings.length;
      const avg =
        totalRatings > 0
          ? (
            store.Ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings
          ).toFixed(2)
          : null;

      const userRating = store.Ratings.find((r) => r.userId === req.user.id);

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: avg,
        userRating: userRating?.value || null,
      };
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stores', error: err.message });
  }
};

// Submit or update rating
export const rateStore = async (req, res) => {
  const { storeId } = req.params;
  const { value } = req.body;
  const userId = req.user.id;

  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const existing = await Rating.findOne({ where: { userId, storeId } });

    if (existing) {
      existing.value = value;
      await existing.save();
      return res.json({ message: 'Rating updated', rating: existing });
    } else {
      const newRating = await Rating.create({ value, userId, storeId });
      return res.status(201).json({ message: 'Rating submitted', rating: newRating });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit rating', error: err.message });
  }
};
