// RightSidebar.js
import React from 'react';
import '../css/dashboard.css'; // Using the same CSS file

const RightSidebar = () => {
  return (
    <div className="right-sidebar">
      <div className="sidebar-card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        
        <div className="device-grid-sidebar">
          <div className="device-card-sidebar purple">
            <div>🌡️</div>
            <div>AC</div>
            <div>ON</div>
          </div>
          <div className="device-card-sidebar yellow">
            <div>💡</div>
            <div>Lights</div>
            <div>OFF</div>
          </div>
          <div className="device-card-sidebar orange">
            <div>🔌</div>
            <div>Power</div>
            <div>ON</div>
          </div>
          <div className="device-card-sidebar cyan">
            <div>🔒</div>
            <div>Security</div>
            <div>ON</div>
          </div>
        </div>
      </div>

      <div className="sidebar-card">
        <div className="card-header">
          <h3 className="card-title">Temperature Range</h3>
        </div>
        <div className="temp-range-display">
          <div className="temp-range-labels">
            <span>05°C</span>
            <span>25°C</span>
          </div>
          <div className="temp-range-slider">
            <div className="slider-track"></div>
            <div className="slider-thumb" style={{ left: '50%' }}></div>
          </div>
        </div>
      </div>

      <div className="sidebar-card">
        <div className="card-header">
          <h3 className="card-title">Power Consumption</h3>
        </div>
        <div className="power-info">
          <div className="power-legend">
            <div className="power-dot"></div>
            <span>Current Usage</span>
          </div>
          <div className="power-spending">1.2 kW</div>
        </div>
        <div className="chart-container">
          <div className="chart-bar"></div>
        </div>
        <div className="chart-labels">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;