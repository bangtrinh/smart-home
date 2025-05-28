import React, { useState, useEffect, useCallback } from 'react';
import {
  getWeatherData,
  getAirQualityData
} from '../../api/weatherApi';
import {
  getContractById,
  getUsersByContractId
} from '../../api/contractApi';
import { getHomeOwnerById } from '../../api/homeOwnerApi';
import { getDevicesByContractId } from '../../api/deviceApi';
import { useWebSocket } from "../../hooks/useWebSocket";
import { publishMqttMessage } from "../../api/mqttApi";
import { checkControlActive } from "../../api/deviceControlApi"

import {
  ChevronDown
} from 'lucide-react';

import '../css/dashboard.css';

function Dashboard({ selectedContractId }) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [homeOwner, setHomeOwner] = useState(null);
  const [members, setMembers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [myDevices, setMyDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const { connected, subscribeToTopic, unsubscribeFromTopic } = useWebSocket(token);

  const handleWebSocketMessage = useCallback((rawMessage, topic) => {
    if (!rawMessage) {
    console.warn("Received empty WebSocket message for topic:", topic);
    return;
    }
    try {
      const payload = JSON.parse(rawMessage);
      const topicParts = topic.split('/');
      const deviceId = topicParts[topicParts.length - 1];
      const newStatus = payload.value;
      console.log("Payload: ", payload.value);

      setDevices(prev =>
        prev.map(device =>
          device.id === deviceId
            ? { ...device, status: newStatus }
            : device
        )
      );
    } catch (err) {
      console.error("Error parsing WebSocket message:", err);
    }
  }, []);

  useEffect(() => {
    if (!selectedContractId) return;

    let subscriptions = [];

    const fetchData = async () => {
      try {
        const contract = await getContractById(selectedContractId);
        if (contract && contract.ownerId) {
          const homeOwnerData = await getHomeOwnerById(contract.ownerId);
          setHomeOwner(homeOwnerData);

          if (homeOwnerData?.address) {
            const weatherData = await getWeatherData(homeOwnerData.address);
            setWeather(weatherData);
            const { lat, lon } = weatherData.coord;
            const airData = await getAirQualityData(lat, lon);
            setAirQuality(airData);
          }

          const usersData = await getUsersByContractId(selectedContractId);
          setMembers(usersData.data);

          const devicesData = await getDevicesByContractId(selectedContractId);
          setDevices(devicesData.data);

          

          if (connected && devicesData.data.length > 0) {
            subscriptions = devicesData.data.map((device) => {
              const topic = `/contract/${selectedContractId}/device/${device.id}`;
              return subscribeToTopic(topic, (message) =>
                handleWebSocketMessage(message, topic)
              );
            });
          }

          const controllable = [];
          for (const device of devicesData.data) {
            const isActive = await checkControlActive(
              user.id, 
              device.id
            );
            if (isActive) {
              controllable.push(device);
            }
          }
          setMyDevices(controllable);
        }
      } catch (err) {
        console.error("Error fetching Dashboard data:", err);
      }
    };

    fetchData();

    return () => {
      subscriptions.forEach(unsubscribeFromTopic);
    };
  }, [selectedContractId, connected]);

  const getAqiLabel = (aqi) => {
    const labels = {
      1: "The air is fresh, a perfect day to go outside!",
      2: "Air quality is fair, you can go out but stay aware.",
      3: "Moderate air, sensitive people should limit outdoor activities.",
      4: "Poor air quality, better to stay indoors today.",
      5: "Very poor air quality, avoid outdoor activities as much as possible."
    };
    return labels[aqi] || "Air quality data unavailable.";
  };

  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear": return "☀️";
      case "Clouds": return "☁️";
      case "Rain": return "🌧️";
      case "Drizzle": return "🌦️";
      case "Thunderstorm": return "⛈️";
      case "Snow": return "❄️";
      case "Mist":
      case "Fog":
      case "Haze":
      case "Smoke":
      case "Dust": return "🌫️";
      default: return "🌡️";
    }
  };

  const handleToggleDevice = async (device) => {
    const newStatus = device.status === '*A: 1' ? '*A: 0' : '*A: 1';
    const payload = {
      value: device.status === '*A: 1' ? '*A: 0' : '*A: 1',
      deviceId: device.id,
      contractId: selectedContractId
    };
    try {
      await publishMqttMessage(payload);

      setDevices(prev =>
        prev.map(d =>
          d.id === device.id ? { ...d, status: newStatus } : d
        )
      );

    setSelectedDevice(prev => 
      prev && prev.id === device.id ? { ...prev, status: newStatus } : prev
    );
    } catch (err) {
      console.error("Failed to publish MQTT message:", err);
    }
  };

  const getColorFromString = (str) => {
    const colors = ["#8b5cf6", "#f97316", "#ec4899", "#ea580c", "#ef4444", "#06b6d4", "#facc15", "#10b981"];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div className="dashboard-wrapper">
      <div className="content-wrapper">
        <div className="main-content-card">
          <div className="welcome-card">
            <div className="welcome-left">
              <h1 className="welcome-title">Hello, {user.username}!</h1>
              <p className="welcome-text">
                Welcome Home! {airQuality ? getAqiLabel(airQuality.list[0].main.aqi) : "--"}
              </p>

              <div className="weather-info">
                <div className="weather-item">
                  <span>{weather ? `${weather.main.temp}°C` : "--°C"}</span>
                  <span>Outdoor temperature</span>
                </div>
                <div className="weather-item">
                  <span>{weather ? getWeatherIcon(weather.weather[0].main) : "No data"}</span>
                  <span>
                    {weather
                      ? weather.weather[0].description.replace(/\b\w/g, (char) => char.toUpperCase())
                      : "Loading weather..."}
                  </span>
                </div>
              </div>
            </div>

            <div className="welcome-right">
              <img src="/images/welcome.png" alt="Welcome" className="welcome-image" />
            </div>
          </div>

          <div className="home-control-card">
            <div className="home-control-header">
              <h2 className="home-title">{homeOwner?.fullName || 'Unknown'}'s Home</h2>
              <div className="home-stats">
                <div className="stat-item">
                  <div className="stat-dot"></div>
                  <span>Indoor temperature</span>
                </div>
                <span>15°C</span>
              </div>
            </div>
            <div className="device-grid">
            {devices.length > 0 ? (
              devices.map((device) => (
                <div
                  key={device.id}
                  className={`device-card ${device.id === selectedDevice?.id ? 'active' : 'inactive'}`}
                  onClick={() => setSelectedDevice(device)}
                >
                  <div className="device-info">
                    <span className="device-name">{device.deviceName}</span>
                    <span className="device-status">{device.status === '*A: 1' ? 'ON' : 'OFF'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No devices found.</p>
            )}
          </div>
        </div>


        {/* Temperature Control */}
        <div className="temperature-control">
          <div className="temp-header">
            <h3 className="temp-title">
              {selectedDevice ? selectedDevice.deviceName : 'Select a device'}
            </h3>
            <div className="temp-toggle">
              <span>15°C</span>
              {selectedDevice && (
              <>
                <div 
                  className={`toggle-switch ${selectedDevice.status === '*A: 0' ? 'off' : ''}`}
                  onClick={() => handleToggleDevice(selectedDevice)}>
                  <div className="toggle-ball"></div>
                </div>
                <span>{selectedDevice.status === '*A: 1' ? 'ON' : 'OFF'}</span>
              </>
            )}
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

        <div className="right-sidebar">
          {/* My Devices */}
          <div className="card my-devices-card">
            <div className="card-header">
              <h3>My Devices</h3>
              <ChevronDown size={16} />
            </div>
            <div className="device-list">
              {myDevices.length === 0 ? (
                <p style={{ padding: "10px" }}>No controllable devices available.</p>
              ) : (
                myDevices.map((device) => (
                  <div
                    key={device.id}
                    className="device-item"
                    style={{ background: getColorFromString(device.deviceName) }} // nếu device có color thì dùng, không thì màu default
                  >
                    <span>{device.deviceName}</span>
                    <div
                      className={`switch ${device.status === "*A: 1" ? "on" : "off"}`}
                      onClick={() => handleToggleDevice(device)}
                    ></div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card members-card">
            <div className="card-header">
              <h3>Members</h3>
            </div>
            <div className="members-list">
                {members.length > 0 ? (
                members.map((member, index) => (
                  <div className="member-item" key={index}>
                    <div className="avatar" style={{ background: getColorFromString(member.username) }}>
                      {member.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="member-name">
                      {member.username.length > 10 
                        ? `${member.username.substring(0, 10)}...` 
                        : member.username}
                    </span>
                    <span className="member-role">
                      {member.roles[0].toLowerCase() || 'Inactive'}
                    </span>
                  </div>
                ))
              ) : (
                <p>No members available.</p>
              )}
            </div>
          </div>

          <div className="card power-card">
            <div className="card-header">
              <h3>Power Consumed</h3>
              <ChevronDown size={16} />
            </div>
            <div className="power-info">
              <div className="power-percentage">
                <span>73%</span> Spending
              </div>
              <div className="chart-placeholder">
                📊 (Chart ở đây — có thể dùng Recharts / Chart.js sau)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
