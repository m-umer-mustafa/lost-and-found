// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ReportItemPage from './components/ReportItemPage';
import EditItem from './components/EditItem';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    found: false,
    category: 'Electronics',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchItems();
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchItems();
    }
  }, [user]);

  // App.js
  const fetchItems = async () => {
    try {
      const params = {
      search: searchTerm,
      category: selectedCategory,
      };

      if (selectedCategory === 'MyItems' && user) {
        params.reportedByUsername = user.username;
      }

      const response = await axios.get('http://localhost:5000/api/items', { params });
      setItems(response.data);
      } catch (error) {
        console.error('Error fetching items', error);
        if (error.response?.status === 403) {
          handleLogout();
        }
        }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewItem({
      ...newItem,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemData = {
        ...newItem,
        reportedById: user ? user._id : null,
        reportedByUsername: user ? user.username : '',
        reportedByEmail: user ? user.email : '',
      };

      if (editingItem) {
        await axios.put(`http://localhost:5000/api/items/${editingItem._id}`, itemData);
      } else {
        await axios.post('http://localhost:5000/api/items', itemData);
      }
      setNewItem({
        name: '',
        description: '',
        found: false,
        category: 'Electronics',
      });
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error('Error submitting item', error);
    }
  };

  const handleEdit = (item) => {
    setNewItem({
      name: item.name,
      description: item.description,
      found: item.found,
      category: item.category,
    });
    setEditingItem(item);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setCurrentPage('home');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        email: loginEmail,
        password: loginPassword,
      });
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      setLoginEmail('');
      setLoginPassword('');
      setError('');
      setCurrentPage('home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
      });
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      setSignupUsername('');
      setSignupEmail('');
      setSignupPassword('');
      setError('');
      setCurrentPage('home');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please check your details and try again.');
    }
  };

  const goToReportPage = () => {
    setCurrentPage('report');
  };

  const goBack = () => {
    setCurrentPage('home');
  };

  const closeEditForm = () => {
    setEditingItem(null);
  };

  const updateItem = () => {
    fetchItems();
  };

  return (
    <div className="container">
      <header className="app-header">
        <h1>Lost and Found</h1>
        {user && (
          <div className="header-actions">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
            <button className="logout-button" onClick={goToReportPage}>
              Report Item
            </button>
          </div>
        )}
      </header>

      {!user ? (
        <div className="nav">
          <button onClick={() => setShowSignup(false)}>Login</button>
          <button onClick={() => setShowSignup(true)}>Sign Up</button>
        </div>
      ) : (
        <div>
          <div className="header-actions">
            <h2 className="welcome-message">WELCOME, {user.username}</h2>
          </div>
        </div>
      )}

      {!user ? (
        <div>
          {showSignup ? (
            <div className="form-container">
              <h2>Create Account</h2>
              {error && <p className="error">{error}</p>}
              <form onSubmit={handleSignupSubmit}>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder='username'
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder='someone@example.com'
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder='password'
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Sign Up</button>
              </form>
            </div>
          ) : (
            <div className="form-container">
              <h2>Welcome Back</h2>
              {error && <p className="error">{error}</p>}
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder='someone@example.com'
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder='password'
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Login</button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div>
          {currentPage === 'home' ? (
            <div className="home-container">
              <h2>Search Items</h2>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="category-select"
                >
                  <option value="">All Categories</option>
                  <option value="MyItems">My Items</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Other">Other</option>
                </select>
                <button className="search-button" onClick={fetchItems}>
                  Search
                </button>
              </div>

              <div className="reports-container">
                <h2>Recent Reports</h2>
                <div className="item-list">
                  {items.map((item) => (
                    <div key={item._id} className="item-card">
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p>Category: {item.category}</p>
                        <p>Status: {item.found ? 'Found' : 'Lost'}</p>
                        {/*<p>Reported By: {item.reportedByUsername}</p>*/}
                        <p>Reporter Email: {item.reportedByEmail}</p>
                      </div>
                      <div className="item-actions">
                        {user && item.reportedByUsername === user.username && (
                          <>
                            <button onClick={() => handleEdit(item)}>Edit</button>
                            <button onClick={() => handleDelete(item._id)}>Delete</button>
                          </>
                        )}
                      </div>
                      {editingItem && (
                        <EditItem
                          item={editingItem}
                          onClose={closeEditForm}
                          onUpdate={updateItem}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <ReportItemPage goBack={goBack} />
          )}
          
        </div>
      )}
    </div>
  );
}

export default App;