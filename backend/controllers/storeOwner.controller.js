import db from '../models/index.js';

const Store = db.Store;
const Rating = db.Rating;
const User = db.User;

export const getStoreRatings = async (req, res) => {
  const ownerId = req.user.id;

  try {
    const store = await Store.findOne({
      where: { ownerId },
      include: [
        {
          model: Rating,
          include: [{ model: User, attributes: ['id', 'name', 'email'] }],
        },
      ],
    });

    if (!store) return res.status(404).json({ message: 'Store not found for this owner' });

    const totalRatings = store.Ratings.length;
    const avg =
      totalRatings > 0
        ? (store.Ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings).toFixed(2)
        : null;

    const ratedUsers = store.Ratings.filter(rating => rating.User !== null).map((rating) => ({
      userId: rating.User.id,
      name: rating.User.name,
      email: rating.User.email,
      rating: rating.value,
    }));

    res.json({
      store: {
        name: store.name,
        address: store.address,
        email: store.email,
      },
      averageRating: avg,
      ratedUsers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ratings', error: err.message });
  }
};
