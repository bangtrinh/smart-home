import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import UserManager from './components/pages/user/UserManager';
import Dashboard from './components/pages/Dashboard'; // Thêm dòng này
import DeviceManager from './components/pages/device/DeviceManager';
import DeviceForm from './components/pages/device/DeviceForm';
import HomeOwnerManager from './components/pages/homeowner/HomeOwnerManager';
import HomeOwnerForm from './components/pages/homeowner/HomeOwnerForm';
import ContractManager from './components/pages/contract/ContractManager';
import ContractForm from './components/pages/contract/ContractForm';
import ContractUsers from './components/pages/contract/ContractUsers';
import ContractDetails from './components/pages/contract/ContractDetails';

import './style/style.css';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/device" element={<AdminLayout><DeviceManager /></AdminLayout>} />
        <Route path="/contracts" element={<AdminLayout><ContractManager /></AdminLayout>} />
        <Route path="/contracts/add" element={<AdminLayout><ContractForm /></AdminLayout>} />
        <Route path="/contracts/edit/:id" element={<AdminLayout><ContractForm /></AdminLayout>} />
        <Route path="/contracts/:id/users" element={<AdminLayout><ContractUsers /></AdminLayout>} />
        <Route path="/contracts/:id" element={<AdminLayout><ContractDetails /></AdminLayout>} />
        <Route path="/homeowners" element={<AdminLayout><HomeOwnerManager /></AdminLayout>} />
        <Route path="/users" element={<AdminLayout><UserManager /></AdminLayout>} />
        <Route path="/devices" element={<AdminLayout><DeviceManager /></AdminLayout>} />
        <Route path="/devices/add" element={<AdminLayout><DeviceForm /></AdminLayout>} />
        <Route path="/devices/edit/:id" element={<AdminLayout><DeviceForm /></AdminLayout>} />
        <Route path="/homeowners" element={<AdminLayout><HomeOwnerManager /></AdminLayout>} />
        <Route path="/homeowners/add" element={<AdminLayout><HomeOwnerForm /></AdminLayout>} />
        <Route path="/homeowners/edit/:id" element={<AdminLayout><HomeOwnerForm /></AdminLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
