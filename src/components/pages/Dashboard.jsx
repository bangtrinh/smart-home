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
import { useTranslation } from 'react-i18next';
import i18n, { getWeatherLanguage, getCurrentWeatherLanguage } from '../../i18n.js';


function Dashboard() {
  const { t, i18n } = useTranslation();
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
      
      setSchedules(prev => ({
        ...prev,
        [deviceId]: response
      }));

      if (deviceId === selectedDevice?.id) {
        const now = new Date();
        const upcoming = response
          .filter(s => {
            const scheduleDate = new Date(s.scheduleTime);
            const isValid = !isNaN(scheduleDate) && scheduleDate > now;
            return isValid;
          })
          .sort((a, b) => new Date(a.scheduleTime) - new Date(b.scheduleTime))[0];

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
      alert(t('dashboard.schedule.errors.cancelSuccess'));
    } catch (error) {
      console.error("Error canceling schedule:", error);
      alert(t('dashboard.schedule.errors.cancelError'));
    }
  };

  const handleNavigateToMyDevices = () => {
    navigate(`/my-devices`);
  };

  useEffect(() => {
    const weatherLang = getCurrentWeatherLanguage();
    if (!selectedContractId) return;

    let subscriptions = [];

    const fetchData = async () => {
      try {
        const contract = await getContractById(selectedContractId);
        if (contract && contract.ownerId) {
          const homeOwnerData = await getHomeOwnerById(contract.ownerId);
          setHomeOwner(homeOwnerData);

          if (homeOwnerData?.address) {
            const weatherData = await getWeatherData(homeOwnerData.address, weatherLang);
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
            if (isActive.data) {
              controllable.push(device);
            }
            await fetchSchedules(device.id);
          }
          setMyDevices(controllable);

          if (!selectedDevice && devicesData.data.length > 0) {
            const defaultDevice = devicesData.data[0];
            setSelectedDevice(defaultDevice);
            localStorage.setItem(`selectedDevice_${selectedContractId}`, JSON.stringify(defaultDevice));
            await fetchSchedules(defaultDevice.id);
          } else if (selectedDevice) {
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
  }, [selectedContractId, connected, handleWebSocketMessage, fetchSchedules, selectedDevice, i18n.language]);

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
        setTimeLeft(t('dashboard.schedule.expired'));
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
  }, [currentSchedule, selectedDevice?.id, fetchSchedules, t]);

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
      alert(t('dashboard.schedule.errors.timeRequired'));
      return;
    }

    const scheduledTime = new Date(scheduleTimeInput);
    const now = new Date();

    if (scheduledTime <= now) {
      alert(t('dashboard.schedule.errors.futureTime'));
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
      alert(t('dashboard.schedule.errors.createSuccess', {
        action: action === '*A: 1' ? t('dashboard.schedule.form.turnOn') : t('dashboard.schedule.form.turnOff'),
        time: scheduleTimeInput
      }));
    } catch (error) {
      console.error("Error creating schedule:", error);
      alert(t('dashboard.schedule.errors.createError'));
    }
  };

  const handleKickUser = async (userId) => {
    try {
      await unLinkFromContract(userId, selectedContractId);
      alert(t('dashboard.members.kickSuccess'));
      const usersData = await getUsersByContractId(selectedContractId);
      setMembers(usersData.data);
      setOpenDropdownIndex(null);
    } catch (err) {
      console.error('Error unlinking user:', err);
      alert(t('dashboard.members.kickError'));
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
              <h1 className="welcome-title">{t('dashboard.welcome.title', { username: user.username })}</h1>
              <p className="welcome-text">
                {t('dashboard.welcome.subtitle')} {airQuality ? t(`dashboard.welcome.aqi.${airQuality.list[0].main.aqi}`) : "--"}
              </p>
              <div className="weather-info">
                <div className="weather-item">
                  <span>{weather ? `${weather.main.temp}°C` : "--°C"}</span>
                  <span>{t('dashboard.welcome.weather.temp')}</span>
                </div>
                <div className="weather-item">
                  <span>{weather ? getWeatherIcon(weather.weather[0].main) : t('dashboard.welcome.weather.noData')}</span>
                  <span>
                    {weather
                      ? weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1).toLowerCase()
                      : t('dashboard.welcome.weather.loading')}
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
              <h2 className="home-title">{t('dashboard.home.title', { name: homeOwner?.fullName || t('dashboard.home.unknown') })}</h2>
              <div className="home-stats">
                <div className="stat-item">
                  <div className="stat-dot"></div>
                  <span>{t('dashboard.home.stats.temp')}</span>
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
                      <span className="device-status">{device.status === '*A: 1' ? t('dashboard.devices.on') : t('dashboard.devices.off')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>{t('dashboard.devices.noDevices')}</p>
              )}
            </div>
          </div>
          <div className="temperature-control">
            <div className="temp-header">
              <h3 className="temp-title">
                {selectedDevice ? selectedDevice.deviceName : t('dashboard.devices.selectDevice')}
              </h3>
              <div className="temp-toggle">
                <span>{t('dashboard.devices.power')}</span>
                {selectedDevice && (
                  <>
                    <div
                      className={`toggle-switch ${selectedDevice.status === '*A: 0' ? 'off' : ''}`}
                      onClick={() => handleToggleDevice(selectedDevice)}
                    >
                      <div className="toggle-ball"></div>
                    </div>
                    <span>{selectedDevice.status === '*A: 1' ? t('dashboard.devices.on') : t('dashboard.devices.off')}</span>
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
                          {t('dashboard.schedule.countdown', {
                            device: selectedDevice.deviceName,
                            action: currentSchedule.action === '*A: 1' 
                              ? t('dashboard.schedule.form.turnOn').toLowerCase() 
                              : t('dashboard.schedule.form.turnOff').toLowerCase()
                          })}
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
                              {t('dashboard.schedule.scheduledTime')}: {new Date(currentSchedule.scheduleTime).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <button
                          className="cancel-button"
                          onClick={() => CancelSchedule(currentSchedule.id)}
                        >
                          {t('dashboard.schedule.cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="schedule-form">
                      <div className="schedule-inputs">
                        <div className="date-picker">
                          <label htmlFor="schedule-date">{t('dashboard.schedule.form.selectDate')}</label>
                          <input
                            type="date"
                            id="schedule-date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="time-picker">
                          <label htmlFor="schedule-time">{t('dashboard.schedule.form.selectTime')}</label>
                          <input
                            type="time"
                            id="schedule-time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="action-selection">
                        <label>{t('dashboard.schedule.form.action')}</label>
                        <div className="action-buttons">
                          <button
                            className={`action-btn ${
                              timerAction === '*A: 1' ? 'active' : ''
                            }`}
                            onClick={() => setTimerAction('*A: 1')}
                          >
                            {t('dashboard.schedule.form.turnOn')}
                          </button>
                          <button
                            className={`action-btn ${
                              timerAction === '*A: 0' ? 'active' : ''
                            }`}
                            onClick={() => setTimerAction('*A: 0')}
                          >
                            {t('dashboard.schedule.form.turnOff')}
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
                        {t('dashboard.schedule.form.setTimer')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="not-my-device">{t('dashboard.devices.notControllable')}</p>
              )
            )}
          </div>
        </div>
        <div className="right-sidebar">
          <div className="card my-devices-card">
            <div className="card-header">
              <h3>{t('dashboard.devices.myDevices.title')}</h3>
              <div 
                className="chevron-wrapper"
                onClick={handleNavigateToMyDevices}
              >
                <ChevronRight size={16} />
              </div>            
            </div>
            <div className="device-list">
              {myDevices.length === 0 ? (
                <p style={{ padding: "10px" }}>{t('dashboard.devices.myDevices.noDevices')}</p>
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
              <h3>{t('dashboard.members.title')}</h3>
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
                      {member.roles[0].toLowerCase() || t('dashboard.members.inactive')}
                    </span>

                    {openDropdownIndex === index && user.email === homeOwner?.email && (
                      <div className="dropdown-kick-menu">
                        <button
                          className="dropdown-item"
                          onClick={() => handleKickUser(member.id)}
                          style={{fontWeight: 'bold', fontSize: 12}}
                        >
                          {t('dashboard.members.kick')}
                          <LogOut size={14} style={{color: '#cc0000'}} />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>{t('dashboard.members.noMembers')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;