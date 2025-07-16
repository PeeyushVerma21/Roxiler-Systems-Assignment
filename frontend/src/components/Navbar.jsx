import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <Link to="#" className="text-lg font-bold">
        Store Ratings
      </Link>

      <div className="flex items-center gap-4">
        {!token ? (
          // Show Login/Register toggle if not logged in
          (isLoginPage || isRegisterPage) && (
            <button
              onClick={() => navigate(isLoginPage ? '/register' : '/login')}
              className="hover:underline cursor-pointer"
            >
              {isLoginPage ? 'Register' : 'Login'}
            </button>
          )
        ) : (
          <>
            {/* Role-based Links */}
            {role === 'user' && (
              <>
                <Link to="/user/stores" className="hover:underline">Browse Stores</Link>
                <Link to="/user/UpdatePass" className="hover:underline">Update Password</Link>
              </>
            )}
            {role === 'admin' && (
              <Link to="/admin/stats" className="hover:underline">Admin Dashboard</Link>
            )}
            {role === 'owner' && (
              <Link to="/owner/dashboard" className="hover:underline">My Store</Link>
            )}
            
            <button
              onClick={handleLogout}
              className="hover:underline text-red-400 cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
