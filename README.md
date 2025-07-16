Steps to run

1. Clone the Repository

2. cd store-rating-platform

3. Setup backend:
   cd backend
   npm install

4. create a .env file:
   PORT=5000
   DB_NAME=your_db
   DB_USER=your_user
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret

5. Start backend:
   npm run dev

6. Setup the Frontend
   cd ../frontend
   npm install

7. Create .env file:
   VITE_BACKEND_URL=http://localhost:5000

8. Start frontend:
   npm run dev
