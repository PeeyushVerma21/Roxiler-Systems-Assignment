import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

import UserModel from './user.model.js';
import StoreModel from './store.model.js';
import RatingModel from './rating.model.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = UserModel(sequelize, Sequelize);
db.Store = StoreModel(sequelize, Sequelize);
db.Rating = RatingModel(sequelize, Sequelize);

db.User.hasMany(db.Rating, { foreignKey: 'userId' });
db.Store.hasMany(db.Rating, { foreignKey: 'storeId' });

db.Rating.belongsTo(db.User, { foreignKey: 'userId' });
db.Rating.belongsTo(db.Store, { foreignKey: 'storeId' });

db.Store.belongsTo(db.User, { foreignKey: 'ownerId', as: 'owner' });

export { sequelize };
export default db;
