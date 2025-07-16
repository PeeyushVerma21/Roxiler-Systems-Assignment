import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    const { name, email, address, password } = form;

    // Basic validation
    if (name.length < 20 || name.length > 60) {
      return setError('Name must be 20–60 characters.');
    }

    if (address.length > 400) {
      return setError('Address is too long.');
    }

    const passRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (!passRegex.test(password) || password.length < 8 || password.length > 16) {
      return setError('Password must be 8–16 chars, 1 uppercase, 1 special char.');
    }

    try {
      const res = await axios.post(BackendUrl + '/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('role', res.data.user.role);
      navigate('/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-xl"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-xl"
        />

        <input
          name="address"
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-xl"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-xl"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl cursor-pointer"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
