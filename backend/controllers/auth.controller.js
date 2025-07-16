import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

const User = db.User;

// Register (Normal User)
export const register = async (req, res) => {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      role: 'user',
    });

    const token = generateToken(user.id);
    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = generateToken(user.id);
    res.json({ token, user: { id: user.id, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Update Password
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  try {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Incorrect current password' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.log(err.res);

    res.status(500).json({ message: 'Could not update password', error: err.message });
  }
};
