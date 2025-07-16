import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', role: '' });
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await axios.get(BackendUrl + `/api/admin/users?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Users</h2>
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
        <select
          value={filters.role}
          onChange={e => setFilters({ ...filters, role: e.target.value })}
          className="px-2 py-1 border rounded"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="owner">Store Owner</option>
        </select>
        <button className="bg-blue-600 text-white px-4 rounded cursor-pointer">Search</button>
      </form>

      <table className="w-full bg-white rounded shadow overflow-hidden text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Address</th>
            <th className="p-2 text-left">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.address}</td>
              <td className="p-2 capitalize">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
