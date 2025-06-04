import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
console.log("API KEY:", process.env.REACT_APP_WEATHER_API_KEY);

// Map ngôn ngữ i18n sang OpenWeather format
const getWeatherLanguage = (locale) => {
  const langMap = {
    'vi': 'vi',
    'en': 'en',
    'ja': 'ja',
    'ko': 'ko',
    'zh': 'zh_cn',
    'zh-CN': 'zh_cn',
    'zh-TW': 'zh_tw',
    'th': 'th',
    'fr': 'fr',
    'de': 'de',
    'es': 'es',
    'ru': 'ru'
  };
  return langMap[locale] || 'en';
};

export const getWeatherData = async (city, language = 'en') => {
  const weatherLang = getWeatherLanguage(language);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=${weatherLang}&appid=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

export const getAirQualityData = async (lat, lon) => {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

// Hàm helper để lấy weather data với ngôn ngữ từ i18n context
export const getLocalizedWeatherData = async (city, i18nInstance) => {
  const currentLanguage = i18nInstance?.language || 'en';
  return await getWeatherData(city, currentLanguage);
};