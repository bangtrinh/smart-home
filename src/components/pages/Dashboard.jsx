import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useContract } from '../../context/ContractContext';
import { useNavigate } from "react-router-dom";
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
import { useWS } from "../../context/WebSocketContext";
import { publishMqttMessage } from "../../api/mqttApi";
import { checkControlActive } from "../../api/deviceControlApi";
import { createSchedule, getSchedulesByDevice, cancelSchedule } from '../../api/scheduleApi';
import { unLinkFromContract } from '../../api/contractApi';
import { ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import '../css/dashboard.css';


function Dashboard() {
  const { selectedContractId } = useContract();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  const navigate = useNavigate();

  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [homeOwner, setHomeOwner] = useState(null);
  const [members, setMembers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [myDevices, setMyDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(() => {
    const savedDevice = localStorage.getItem(`selectedDevice_${selectedContractId}`);
    return savedDevice ? JSON.parse(savedDevice) : null;
  });
  const [scheduleTime, setScheduleTime] = useState('');
  const [timerAction, setTimerAction] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const isMyDevice = useMemo(() => {
    return myDevices.some(device => device.id === selectedDevice?.id);
  }, [myDevices, selectedDevice]);

  const { connected, subscribeToTopic, unsubscribeFromTopic } = useWS();

  const handleWebSocketMessage = useCallback((rawMessage, topic) => {
    if (!rawMessage) {
      console.warn("Received empty WebSocket message for topic:", topic);
      return;
    }
    try {
      const payload = JSON.parse(rawMessage);
      console.log('WebSocket payload:', payload);
      const deviceId = payload.deviceId;
      const newStatus = payload.value;

      setDevices(prev =>
        prev.map(device =>
          device.id === deviceId
            ? { ...device, status: newStatus }
            : device
        )
      );

      setSelectedDevice(prev =>
        prev && prev.id === deviceId
          ? { ...prev, status: newStatus }
          : prev
      );
    } catch (err) {
      console.error("Error parsing WebSocket message:", err);
    }
  }, []);

  const fetchSchedules = useCallback(async (deviceId) => {
    try {
      const response = await getSchedulesByDevice(deviceId);
      console.log(`Schedules for device ${deviceId}:`, response);
      
      // Store schedules for the device
      setSchedules(prev => ({
        ...prev,
        [deviceId]: response
      }));

      // Only update currentSchedule if fetching for the selected device
      if (deviceId === selectedDevice?.id) {
        const now = new Date();
        const upcoming = response
          .filter(s => {
            const scheduleDate = new Date(s.scheduleTime);
            const isValid = !isNaN(scheduleDate) && scheduleDate > now;
            console.log(`Schedule ${s.id}:`, { scheduleTime: s.scheduleTime, isValid });
            return isValid;
          })
          .sort((a, b) => new Date(a.scheduleTime) - new Date(b.scheduleTime))[0];

        console.log(`Upcoming schedule for device ${deviceId}:`, upcoming);
        setCurrentSchedule(upcoming || null);
      }
    } catch (err) {
      console.error(`Error fetching schedules for device ${deviceId}:`, err);
    }
  }, [selectedDevice?.id]);

  const CancelSchedule = async (scheduleId) => {
    try {
      await cancelSchedule(scheduleId);
      if (selectedDevice) {
        await fetchSchedules(selectedDevice.id);
      }
      alert("Đã hủy lịch hẹn thành công");
    } catch (error) {
      console.error("Lỗi khi hủy lịch hẹn:", error);
      alert("Không thể hủy lịch. Vui lòng thử lại.");
    }
  };

  const handleNavigateToMyDevices = () => {
  navigate(`/my-devices`);
  };

  // Main data fetching effect
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
            const isActive = await checkControlActive(user.id, device.id);
            console.log("Check: " + isActive.data);
            if (isActive.data) {
              controllable.push(device);
            }
            // Fetch schedules for all devices but don't override currentSchedule
            await fetchSchedules(device.id);
          }
          setMyDevices(controllable);

          // Restore or set default selectedDevice
          if (!selectedDevice && devicesData.data.length > 0) {
            const defaultDevice = devicesData.data[0];
            setSelectedDevice(defaultDevice);
            localStorage.setItem(`selectedDevice_${selectedContractId}`, JSON.stringify(defaultDevice));
            await fetchSchedules(defaultDevice.id);
          } else if (selectedDevice) {
            // Validate selectedDevice exists in devices list
            const deviceExists = devicesData.data.some(d => d.id === selectedDevice.id);
            if (!deviceExists) {
              const defaultDevice = devicesData.data[0];
              setSelectedDevice(defaultDevice);
              localStorage.setItem(`selectedDevice_${selectedContractId}`, JSON.stringify(defaultDevice));
              await fetchSchedules(defaultDevice.id);
            } else {
              await fetchSchedules(selectedDevice.id);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching Dashboard data:", err);
      }
    };

    fetchData();

    return () => {
      subscriptions.forEach(unsubscribeFromTopic);
    };
  }, [selectedContractId, connected, handleWebSocketMessage, fetchSchedules, selectedDevice]);

  // Countdown timer effect
  useEffect(() => {
    if (!currentSchedule || !selectedDevice) {
      setTimeLeft('');
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const scheduleTime = new Date(currentSchedule.scheduleTime);
      const timeDiff = scheduleTime - now;

      if (timeDiff <= 0) {
        console.log(`Schedule ${currentSchedule.id} expired`);
        setTimeLeft('Expired');
        setCurrentSchedule(null);
        fetchSchedules(selectedDevice.id);
        return;
      }

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [currentSchedule, selectedDevice?.id, fetchSchedules]);

  // Persist selectedDevice to localStorage
  useEffect(() => {
    if (selectedDevice) {
      localStorage.setItem(`selectedDevice_${selectedContractId}`, JSON.stringify(selectedDevice));
    }
  }, [selectedDevice, selectedContractId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.member-item')) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  

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
      value: newStatus,
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

  const handleSetTimer = async (device, scheduleTimeInput, action) => {
    if (!scheduleTimeInput || !action) {
      alert("Vui lòng chọn thời gian và hành động.");
      return;
    }

    const scheduledTime = new Date(scheduleTimeInput);
    const now = new Date();

    if (scheduledTime <= now) {
      alert("Thời gian phải nằm trong tương lai.");
      return;
    }

    const formatDateTimeWithT = (date) => {
      const pad = (n) => n.toString().padStart(2, '0');
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };

    const scheduleDTO = {
      deviceId: device.id,
      userId: user.id,
      action,
      scheduleTime: formatDateTimeWithT(scheduledTime),
    };

    try {
      await createSchedule(scheduleDTO);
      await fetchSchedules(device.id);
      alert(`Đã đặt lịch ${action === '*A: 1' ? 'bật' : 'tắt'} thiết bị vào lúc ${scheduleTimeInput}`);
    } catch (error) {
      console.error("Lỗi khi tạo lịch hẹn giờ:", error);
      alert("Không thể tạo lịch. Vui lòng thử lại.");
    }
  };

  const handleKickUser = async (userId) => {
    try {
      await unLinkFromContract(userId, selectedContractId);
      alert('User removed successfully!');
      const usersData = await getUsersByContractId(selectedContractId);
          setMembers(usersData.data);
      setOpenDropdownIndex(null);
    } catch (err) {
      console.error('Error unlinking user:', err);
      alert('Failed to remove user.');
    }
  };

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
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
                  <span>Outdoor Temperature</span>
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
          <div className="temperature-control">
            <div className="temp-header">
              <h3 className="temp-title">
                {selectedDevice ? selectedDevice.deviceName : 'Select a device'}
              </h3>
              <div className="temp-toggle">
                <span>POWER</span>
                {selectedDevice && (
                  <>
                    <div
                      className={`toggle-switch ${selectedDevice.status === '*A: 0' ? 'off' : ''}`}
                      onClick={() => handleToggleDevice(selectedDevice)}
                    >
                      <div className="toggle-ball"></div>
                    </div>
                    <span>{selectedDevice.status === '*A: 1' ? 'ON' : 'OFF'}</span>
                  </>
                )}
              </div>
            </div>

            {selectedDevice && (
              isMyDevice ? (
                <div className="schedule-container">
                  {currentSchedule ? (
                    <div
                      className="countdown-wrapper"
                      style={{ backgroundImage: "url('/images/timer-background.jpg')" }}
                    >
                      <div className="countdown-display">
                        <div className="action-display">
                          {selectedDevice.deviceName +
                            " sẽ được " +
                            (currentSchedule.action === '*A: 1' ? 'bật' : 'tắt') +
                            " sau"}
                        </div>
                        <div className="time-numbers">
                          {timeLeft
                            ? timeLeft.split(':').map((item, index) => (
                                <span key={index}>{item}</span>
                              ))
                            : ['00', '00', '00'].map((item, index) => (
                                <span key={index}>{item}</span>
                              ))}
                        </div>
                        <div className="schedule-info">
                          <div className="info-row">
                            <span className="info-value">
                              {new Date(currentSchedule.scheduleTime).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <button
                          className="cancel-button"
                          onClick={() => CancelSchedule(currentSchedule.id)}
                        >
                          Hủy lịch
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="schedule-form">
                      <div className="schedule-inputs">
                        <div className="date-picker">
                          <label htmlFor="schedule-date">Chọn ngày:</label>
                          <input
                            type="date"
                            id="schedule-date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="time-picker">
                          <label htmlFor="schedule-time">Chọn giờ:</label>
                          <input
                            type="time"
                            id="schedule-time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="action-selection">
                        <label>Hành động:</label>
                        <div className="action-buttons">
                          <button
                            className={`action-btn ${
                              timerAction === '*A: 1' ? 'active' : ''
                            }`}
                            onClick={() => setTimerAction('*A: 1')}
                          >
                            Bật
                          </button>
                          <button
                            className={`action-btn ${
                              timerAction === '*A: 0' ? 'active' : ''
                            }`}
                            onClick={() => setTimerAction('*A: 0')}
                          >
                            Tắt
                          </button>
                        </div>
                      </div>
                      <button
                        className="schedule-submit"
                        onClick={() => {
                          if (scheduleDate && scheduleTime && timerAction) {
                            const dateTime = `${scheduleDate}T${scheduleTime}`;
                            handleSetTimer(selectedDevice, dateTime, timerAction);
                          }
                        }}
                      >
                        Đặt hẹn giờ
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="not-my-device">Thiết bị này không thuộc quyền quản lý của bạn.</p>
              )
            )}
          </div>

        </div>
        <div className="right-sidebar">
          <div className="card my-devices-card">
            <div className="card-header">
              <h3>My Devices</h3>
              <div 
                className="chevron-wrapper"
                onClick={() => handleNavigateToMyDevices ()}
              >
                <ChevronRight size={16} />
              </div>            
            </div>
            <div className="device-list">
              {myDevices.length === 0 ? (
                <p style={{ padding: "10px" }}>No controllable devices available.</p>
              ) : (
                myDevices.map((device) => (
                  <div
                    key={device.id}
                    className="device-item"
                    style={{ background: getColorFromString(device.deviceName) }}
                  >
                    <span>{device.deviceName}</span>
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
                    <div className="avatar" style={{ background: getColorFromString(member.username) }}
                    onClick={() => toggleDropdown(index)}>
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

                    {/* Dropdown */}
                    {openDropdownIndex === index && user.roles.includes('OWNER') && (
                      <div className="dropdown-kick-menu">
                        <button
                          className="dropdown-item"
                          onClick={() => handleKickUser(member.id)}
                          style={{fontWeight: 'bold', fontSize: 12}}
                        >
                            Kick
                          <LogOut size={14} style={{color: '#cc0000'}} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No members available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
