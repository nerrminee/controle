import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAdminAuthenticated, loginAdmin } from '../services/adminConnectionStore';

const AdminRoute = () => {
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated());
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    try {
      loginAdmin(password);
      setAuthenticated(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (authenticated && window.location.pathname === '/admin/login') {
    return <Navigate to="/admin/connection-times" replace />;
  }

  if (authenticated) return <Outlet />;

  if (window.location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-login-page">
      <form className="custom-card admin-login-card" onSubmit={handleSubmit}>
        <h2>Connexion admin</h2>
        <p className="text-secondary">Acces reserve a la gestion des temps de connexion.</p>

        {error && <div className="admin-alert admin-alert-danger">{error}</div>}

        <label className="form-field">
          <span>Mot de passe</span>
          <input
            type="password"
            className="search-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mot de passe admin"
          />
        </label>

        <button className="btn btn-primary" type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default AdminRoute;
