import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import UserManager from './components/pages/user/UserManager';
import Dashboard from './components/pages/Dashboard';
import AdminDashboard from './components/pages/AdminDashboard';
import DeviceManager from './components/pages/device/DeviceManager';
import DeviceForm from './components/pages/device/DeviceForm';
import HomeOwnerManager from './components/pages/homeowner/HomeOwnerManager';
import HomeOwnerForm from './components/pages/homeowner/HomeOwnerForm';
import ContractManager from './components/pages/contract/ContractManager';
import ContractForm from './components/pages/contract/ContractForm';
import ContractUsers from './components/pages/contract/ContractUsers';
import ContractDetails from './components/pages/contract/ContractDetails';
import Login from './components/pages/auth/LoginForm'; 
import RegisterForm from './components/pages/auth/RegisterForm';
import ForgotPassWord from './components/pages/auth/ForgotPassWord';
import ConfirmResetPassword from './components/pages/auth/ConfirmResetPassword';
import ChangePasswordForm from './components/pages/auth/ChangePasswordForm';
import MyContracts from './components/pages/contract/MyContracts';
import MyDevices from './components/pages/device/MyDevices';
import HomeOwnerDetails from './components/pages/homeowner/HomeOwnerDetails';
import './App.css'; // Import your global styles
import { WebSocketProvider } from './context/WebSocketContext';
import DeviceControlHistoryPage from './components/pages/device/DeviceControlHistoryPage'; 
import EditProfile from './components/EditProfile';
import AdminRoute from './components/AdminRoute';
import NotFoundPage from './components/NotFoundPage';
import UserRoute from './components/UserRoute';



// Hàm kiểm tra đã đăng nhập chưa
const isLoggedIn = () => {
  return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
};

// Route bảo vệ
const PrivateRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <WebSocketProvider>
      <BrowserRouter>
        <Routes>
          {/* Route login */}
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<RegisterForm />} />
          <Route path ="/forgotPassword" element={<ForgotPassWord />} />
          <Route path="/confirmResetPassword" element={<ConfirmResetPassword />} />
          {/* Private routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />
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
              <AdminRoute> {/* Thay PrivateRoute bằng AdminRoute */}
                <AdminLayout>
                  <DeviceManager />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/my-devices"
            element={
              <UserRoute>
                <AdminLayout>
                  <MyDevices />
                </AdminLayout>
              </UserRoute>
            }
          />
          <Route
            path="/devices/add"
            element={
              <AdminRoute>
                <AdminLayout>
                  <DeviceForm />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/devices/edit/:id"
            element={
              <AdminRoute>
                <AdminLayout>
                  <DeviceForm />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/devices/history"
            element={
              <UserRoute>
                <AdminLayout>
                  <DeviceControlHistoryPage />
                </AdminLayout>
              </UserRoute>
            }
          />

          {/* Contract routes */}
          <Route
            path="/contracts"
            element={
              <AdminRoute>
                <AdminLayout>
                  <ContractManager />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/my-contracts"
            element={
              <UserRoute>
                <AdminLayout>
                  <MyContracts />
                </AdminLayout>
              </UserRoute>
            }
          />
          <Route
            path="/contracts/add"
            element={
              <AdminRoute>
                <AdminLayout>
                  <ContractForm />
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/contracts/edit/:id"
            element={
              <AdminRoute>
                <AdminLayout>
                  <ContractForm />
                </AdminLayout>
              </AdminRoute>
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
          <Route
            path="/edit-profile"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <EditProfile />
                </AdminLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/not-found"
            element={
                  <NotFoundPage />
            }
          />

          {/* Nếu route không đúng thì chuyển về login */}
          <Route path="*" element={<Navigate to={isLoggedIn() ? "/not-found" : "/login"} />} />
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}

export default App;
