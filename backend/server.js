import app from './app.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 5000;

try {
  await sequelize.sync(); // Sync DB tables
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('Error starting server:', err);
}
