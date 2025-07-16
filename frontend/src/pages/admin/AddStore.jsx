import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddStore = () => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(BackendUrl + '/api/admin/users?role=owner', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setOwners(res.data))
      .catch(err => console.error('Error fetching owners', err));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post(BackendUrl + '/api/admin/add-store', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Store added successfully');
      setForm({ name: '', email: '', address: '', ownerId: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add store');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Add New Store</h2>
      {message && <p className="text-sm text-red-500 mb-2">{message}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Store Name" value={form.name} onChange={handleChange}
          className="w-full border rounded px-3 py-2" required />
        <input type="email" name="email" placeholder="Store Email" value={form.email} onChange={handleChange}
          className="w-full border rounded px-3 py-2" required />
        <input type="text" name="address" placeholder="Store Address" value={form.address} onChange={handleChange}
          className="w-full border rounded px-3 py-2" required />
        <select name="ownerId" value={form.ownerId} onChange={handleChange}
          className="w-full border rounded px-3 py-2" required>
          <option value="">Select Store Owner</option>
          {owners.map(o => (
            <option key={o.id} value={o.id}>
              {o.name} ({o.email})
            </option>
          ))}
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full cursor-pointer">Add Store</button>
      </form>
    </div>
  );
};

export default AddStore;
