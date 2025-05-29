import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import UserManager from './components/pages/user/UserManager';
import Dashboard from './components/pages/Dashboard';
import DeviceManager from './components/pages/device/DeviceManager';
import DeviceForm from './components/pages/device/DeviceForm';
import HomeOwnerManager from './components/pages/homeowner/HomeOwnerManager';
import HomeOwnerForm from './components/pages/homeowner/HomeOwnerForm';
import ContractManager from './components/pages/contract/ContractManager';
import ContractForm from './components/pages/contract/ContractForm';
import ContractUsers from './components/pages/contract/ContractUsers';
import ContractDetails from './components/pages/contract/ContractDetails';
import Login from './components/LoginForm'; 
import RegisterForm from './components/pages/auth/RegisterForm';
import ForgotPassWord from './components/pages/auth/ForgotPassWord';
import ConfirmResetPassword from './components/pages/auth/ConfirmResetPassword';
import ChangePasswordForm from './components/ChangePasswordForm';
import MyContracts from './components/pages/contract/MyContracts';
import MyDevices from './components/pages/device/MyDevices';



import './style/style.css';
import HomeOwnerDetails from './components/pages/homeowner/HomeOwnerDetails';

// Hàm kiểm tra đã đăng nhập chưa
const isLoggedIn = () => {
  return !!localStorage.getItem('token') || !!sessionStorage.getItem('token'); // nếu có token -> true
};

// Route bảo vệ
const PrivateRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route login */}
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<RegisterForm />} />
        <Route path ="/forgotPassword" element={<ForgotPassWord />} />
        <Route path="/confirmResetPassword" element={<ConfirmResetPassword />} />
        {/* Private routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/device"
          element={
            <PrivateRoute>
              <AdminLayout>
                <DeviceManager />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        {/* Các route khác tương tự */}
        <Route
          path="/devices"
          element={
            <PrivateRoute>
              <AdminLayout>
                <DeviceManager />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-devices"
          element={
            <PrivateRoute>
              <AdminLayout>
                <MyDevices />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/devices/add"
          element={
            <PrivateRoute>
              <AdminLayout>
                <DeviceForm />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/devices/edit/:id"
          element={
            <PrivateRoute>
              <AdminLayout>
                <DeviceForm />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Contract routes */}
        <Route
          path="/contracts"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ContractManager />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/my-contracts"
          element={
            <PrivateRoute>
              <AdminLayout>
                <MyContracts />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/contracts/add"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ContractForm />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/contracts/edit/:id"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ContractForm />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/contracts/:id/users"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ContractUsers />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/contracts/:id"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ContractDetails />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Homeowners */}
        <Route
          path="/homeowners"
          element={
            <PrivateRoute>
              <AdminLayout>
                <HomeOwnerManager />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/homeowners/add"
          element={
            <PrivateRoute>
              <AdminLayout>
                <HomeOwnerForm />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/homeowners/edit/:id"
          element={
            <PrivateRoute>
              <AdminLayout>
                <HomeOwnerForm />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/homeowners/:ownerId"
          element={
            <PrivateRoute>
              <AdminLayout>
                <HomeOwnerDetails />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Users */}
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <AdminLayout>
                <UserManager />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <AdminLayout>
                <ChangePasswordForm />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Nếu route không đúng thì chuyển về login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
