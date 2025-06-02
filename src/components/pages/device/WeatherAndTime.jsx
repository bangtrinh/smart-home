import React, { useState, useEffect } from 'react';
import '../Css/WeatherAndTime.css';
// cái này là component hiển thị thời gian và thời tiết
// sử dụng API Open Meteo để lấy dữ liệu thời tiết 
// xem được thì bỏ vô ko thì thôi =))
const cities = [
  { name: 'Hà Nội', lat: 21.0285, lon: 105.8542 },
  { name: 'Đà Nẵng', lat: 16.0544, lon: 108.2022 },
  { name: 'TP.Hồ Chí Minh', lat: 10.8231, lon: 106.6297 },
  { name: 'Hải Phòng', lat: 20.8449, lon: 106.6881 },
  { name: 'Cần Thơ', lat: 10.0452, lon: 105.7469 },
];

function WeatherAndTime() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [loading, setLoading] = useState(false);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather when selectedCity changes
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lon}&current_weather=true`
        );
        const data = await res.json();
        setWeather(data.current_weather);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  // Determine the weather condition to apply the correct animation class
  const getWeatherAnimationClass = () => {
    if (!weather) return '';
    const code = weather.weathercode;

    if ([95, 96, 99].includes(code)) return 'thunderstorm-animation';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(code)) return 'rain-animation';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow-animation';
    if ([1, 2, 3].includes(code)) return 'cloudy-animation';
    if (code === 0) return 'sunny-animation';
    return 'default-animation';
  };

  // Render weather icon (simplified for animation focus)
  const renderWeatherIcon = () => {
    if (!weather) return null;

    const code = weather.weathercode;

    if ([95, 96, 99].includes(code)) {
      return <span className="weather-icon thunderstorm">⛈️⚡️</span>;
    }
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67].includes(code)) {
      return <span className="weather-icon rain">🌧️</span>;
    }
    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      return <span className="weather-icon snow">❄️</span>;
    }
    if ([1, 2, 3].includes(code)) {
      return <span className="weather-icon cloud">☁️</span>;
    }
    if (code === 0) {
      return <span className="weather-icon sun">☀️</span>;
    }
    return <span className="weather-icon">🌤️</span>;
  };

  return (
    <div className={`weather-time-container ${getWeatherAnimationClass()}`}>
      <div className="animation-overlay" /> {/* Overlay for weather effects */}
      <div className="time-section">
        <h3 className="section-title">
          <span className="icon">🕒</span> Giờ hiện tại
        </h3>
        <p className="main-info">
          {time.toLocaleTimeString('vi-VN', { hour12: false })}
        </p>
        <p className="sub-info">
          {time.toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>

        <label>
          Chọn thành phố:
          <select
            value={selectedCity.name}
            onChange={(e) =>
              setSelectedCity(cities.find((c) => c.name === e.target.value))
            }
            className="city-select"
          >
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="weather-section">
        <h3 className="section-title">
          <span className="icon">🌤</span> Thời tiết tại {selectedCity.name}
        </h3>
        {loading ? (
          <p className="loading">Đang tải thời tiết...</p>
        ) : weather ? (
          <div>
            <p className="main-info">
              {renderWeatherIcon()} Nhiệt độ: {weather.temperature}°C
            </p>
            <p className="sub-info">Gió: {weather.windspeed} km/h</p>
          </div>
        ) : (
          <p className="loading">Không có dữ liệu thời tiết</p>
        )}
      </div>
    </div>
  );
}

export default WeatherAndTime;