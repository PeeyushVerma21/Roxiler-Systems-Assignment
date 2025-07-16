import React, { useState } from 'react';
import axios from 'axios';

const UpdatePass = () => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    const { currentPassword, newPassword } = form;

    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (!passRegex.test(newPassword) || newPassword.length < 8 || newPassword.length > 16) {
      return setError(
        'Password must be 8–16 characters long, include 1 uppercase and 1 special character.'
      );
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        BackendUrl + '/api/auth/update-password',
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Update Password</h2>

        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded focus:outline-none"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={form.newPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded focus:outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default UpdatePass;
