import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreList = () => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const token = localStorage.getItem('token');

  const fetchStores = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(BackendUrl + `/api/admin/stores?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
    } catch (err) {
      console.error('Failed to load stores');
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    fetchStores();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Stores</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Name"
          value={filters.name}
          onChange={e => setFilters({ ...filters, name: e.target.value })}
          className="px-2 py-1 border rounded"
        />
        <input
          type="text"
          placeholder="Email"
          value={filters.email}
          onChange={e => setFilters({ ...filters, email: e.target.value })}
          className="px-2 py-1 border rounded"
        />
        <input
          type="text"
          placeholder="Address"
          value={filters.address}
          onChange={e => setFilters({ ...filters, address: e.target.value })}
          className="px-2 py-1 border rounded"
        />
        <button className="bg-green-600 text-white px-4 rounded cursor-pointer">Search</button>
      </form>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Store Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Address</th>
            <th className="p-2 text-left">Avg. Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id} className="border-b">
              <td className="p-2">{store.name}</td>
              <td className="p-2">{store.email}</td>
              <td className="p-2">{store.address}</td>
              <td className="p-2">{store.rating || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreList;
