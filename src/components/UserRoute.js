// components/AdminRoute.js
import { Navigate, Outlet } from 'react-router-dom';

const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (user?.roles.includes('OWNER') || user?.roles.includes('MEMBER')) {
    return token ? children : <Navigate to="/not-found" />;
  }
  
  return <Navigate to="/not-found" replace />;
};

export default UserRoute;