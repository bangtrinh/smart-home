import React, { useState } from 'react';
import {
  Thermometer,
  Cloud,
  Lightbulb,
  Refrigerator,
  Fan,
  Waves,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

// Import CSS
import '../css/dashboard.css';
import RightSidebar from '../layout/RightSidebar'; // Sửa đường dẫn import

function Dashboard() {
  const [temperature, setTemperature] = useState(25);

  const weatherData = {
    temperature: 25,
    condition: "Fuzzy cloudy weather",
    humidity: "35%",
    location: "Living Room"
  };

  const familyMembers = [
    { name: "Scarlett", role: "Admin", avatar: "S", color: "#8b5cf6" },
    { name: "Nanya", role: "Manager", avatar: "N", color: "#f97316" },
    { name: "Riya", role: "Manager", avatar: "R", color: "#ec4899" },
    { name: "Dad", role: "Publisher", avatar: "D", color: "#ea580c" },
    { name: "Mom", role: "Manager", avatar: "M", color: "#ef4444" }
  ];

  const adjustTemperature = (increment) => {
    setTemperature(prev => Math.max(0, Math.min(50, prev + increment)));
  };

  const userInfo = {
    name: "Scarlett"
  };

  return (
    <div className="content-wrapper">
      <div className="main-content-card">
        {/* Welcome Card */}
        <div className="welcome-card">
          <h1 className="welcome-title">Hello, Scarlett!</h1>
          <p className="welcome-text">Welcome Home! The on-roadly is good & fresh you can go out today.</p>
          
          <div className="weather-info">
            <div className="weather-item">
              <span>+25°C</span>
              <span>Outdoor temperature</span>
            </div>
            <div className="weather-item">
              <span>☁️</span>
              <span>Fuzzy cloudy weather</span>
            </div>
          </div>
        </div>

        {/* Home Control Card */}
        <div className="home-control-card">
          <div className="home-control-header">
            <h2 className="home-title">Scarlett's Home</h2>
            <div className="home-stats">
              <div className="stat-item">
                <div className="stat-dot"></div>
                <span>Refridgeretter Temperature</span>
              </div>
              <span>15°C</span>
            </div>
          </div>

          <div className="device-grid">
            <div className="device-card inactive">
              <div className="device-info">
                <span className="device-name">Air Conditioner</span>
                <span className="device-status">OFF</span>
              </div>
            </div>
            <div className="device-card inactive">
              <div className="device-info">
                <span className="device-name">Lights</span>
                <span className="device-status">OFF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Temperature Control */}
        <div className="temperature-control">
          <div className="temp-header">
            <h3 className="temp-title">Living Room Temperature</h3>
            <div className="temp-toggle">
              <span>15°C</span>
              <div className="toggle-switch">
                <div className="toggle-ball"></div>
              </div>
              <span>ON</span>
            </div>
          </div>

          <div className="temp-display">
            <div className="temp-circle">
              <span className="temp-value">15°C</span>
            </div>
          </div>

          <div className="temp-controls">
            <span>05°C</span>
            <button className="temp-button minus">-</button>
            <button className="temp-button plus">+</button>
            <span>25°C</span>
          </div>
        </div>
      </div>    
    </div>
  );
}

export default Dashboard;
