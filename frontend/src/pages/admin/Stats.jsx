import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Stats = () => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [stats, setStats] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(BackendUrl + '/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Platform Statistics</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl">{stats.totalUsers ?? '-'}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold">Total Stores</h2>
          <p className="text-3xl">{stats.totalStores ?? '-'}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h2 className="text-xl font-semibold">Total Ratings</h2>
          <p className="text-3xl">{stats.totalRatings ?? '-'}</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
