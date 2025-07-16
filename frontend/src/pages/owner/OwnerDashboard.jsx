import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OwnerDashboard = () => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [data, setData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(BackendUrl + '/api/owner/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setData(res.data))
      .catch(err => console.error('Failed to load owner dashboard', err));
  }, []);

  if (!data) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50 space-y-6">
      <h1 className="text-2xl font-bold">My Store Dashboard</h1>

      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-xl font-semibold mb-2">Store Details</h2>
        <p><strong>Name:</strong> {data.store.name}</p>
        <p><strong>Email:</strong> {data.store.email}</p>
        <p><strong>Address:</strong> {data.store.address}</p>
        <p><strong>Average Rating:</strong> {data.averageRating || 'No ratings yet'}</p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-xl font-semibold mb-4">Users Who Rated</h2>

        {data.ratedUsers.length === 0 ? (
          <p>No ratings yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Rating</th>
              </tr>
            </thead>
            <tbody>
              {data.ratedUsers.map((user, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
