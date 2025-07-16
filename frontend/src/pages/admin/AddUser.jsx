import React, { useState } from 'react';
import axios from 'axios';

const AddUser = () => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user',
  });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    const { name, email, password, address, role } = form;

    if (name.length < 20 || name.length > 60) {
      return setMessage('Name must be 20–60 characters');
    }
    if (address.length > 400) {
      return setMessage('Address too long');
    }
    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (!passRegex.test(password) || password.length < 8 || password.length > 16) {
      return setMessage('Password must be 8–16 chars, 1 uppercase & 1 special char');
    }

    try {
      await axios.post( BackendUrl + '/api/admin/add-user', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('User added successfully');
      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add user');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Add New User</h2>
      {message && <p className="text-sm text-red-500 mb-2">{message}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange}
          className="w-full border rounded px-3 py-2" required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
          className="w-full border rounded px-3 py-2" required />
        <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange}
          className="w-full border rounded px-3 py-2" required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange}
          className="w-full border rounded px-3 py-2" required />
        <select name="role" value={form.role} onChange={handleChange}
          className="w-full border rounded px-3 py-2">
          <option value="user">Normal User</option>
          <option value="admin">Admin</option>
          <option value="owner">Store Owner</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full cursor-pointer">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;
