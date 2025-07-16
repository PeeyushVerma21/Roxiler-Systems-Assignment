import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

import Stats from './Stats';
import AddUser from './AddUser';
import AddStore from './AddStore';
import UserList from './UserList';
import StoreList from './StoreList';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <NavLink to="/admin/stats" className="block hover:underline">Dashboard Stats</NavLink>
        <NavLink to="/admin/add-user" className="block hover:underline">Add User</NavLink>
        <NavLink to="/admin/add-store" className="block hover:underline">Add Store</NavLink>
        <NavLink to="/admin/users" className="block hover:underline">All Users</NavLink>
        <NavLink to="/admin/stores" className="block hover:underline">All Stores</NavLink>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Routes>
          <Route path="stats" element={<Stats />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="add-store" element={<AddStore />} />
          <Route path="users" element={<UserList />} />
          <Route path="stores" element={<StoreList />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
