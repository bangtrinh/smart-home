// components/AdminRoute.js
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (user?.roles.includes('ADMIN')) {
    return token ? children : <Navigate to="/not-found" />;
  }
  
  return <Navigate to="/not-found" replace />;
};

export default AdminRoute;