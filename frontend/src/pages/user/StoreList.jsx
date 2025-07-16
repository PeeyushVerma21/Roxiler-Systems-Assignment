import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StoreList = () => {
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchStores = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(search).toString();
      const res = await axios.get(BackendUrl + `/api/user/stores?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores:', err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    fetchStores();
  };

  const handleRate = async (storeId, newRating) => {
    if (!newRating || newRating < 1 || newRating > 5) {
      return alert('Rating must be between 1 and 5');
    }

    try {
      await axios.post(
        BackendUrl + `/api/user/rate/${storeId}`,
        { value: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStores(); // refresh
    } catch (err) {
      alert('Failed to submit rating');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Stores</h1>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          placeholder="Search by name"
          value={search.name}
          onChange={e => setSearch({ ...search, name: e.target.value })}
          className="border rounded px-3 py-2 w-1/3"
        />
        <input
          placeholder="Search by address"
          value={search.address}
          onChange={e => setSearch({ ...search, address: e.target.value })}
          className="border rounded px-3 py-2 w-1/3"
        />
        <button className="bg-blue-600 text-white px-4 rounded">Search</button>
      </form>

      {loading ? (
        <p>Loading stores...</p>
      ) : stores.length === 0 ? (
        <p>No stores found</p>
      ) : (
        <div className="grid gap-4">
          {stores.map(store => (
            <div key={store.id} className="bg-white p-4 rounded-xl shadow space-y-2">
              <h2 className="text-lg font-semibold">{store.name}</h2>
              <p className="text-sm text-gray-600">{store.address}</p>
              <p>
                <strong>Average Rating:</strong>{' '}
                {store.averageRating ? store.averageRating : 'Not rated yet'}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="5"
                  defaultValue={store.userRating || ''}
                  placeholder="Your Rating"
                  className="w-24 px-2 py-1 border rounded"
                  id={`rate-${store.id}`}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById(`rate-${store.id}`);
                    const value = parseInt(input.value);
                    handleRate(store.id, value);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  {store.userRating ? 'Update Rating' : 'Submit Rating'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreList;
