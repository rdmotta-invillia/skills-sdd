import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    id: 3390760,
    name: 'Recife',
    country: 'Brasil',
    region: 'Pernambuco',
    latitude: -8.05389,
    longitude: -34.88111,
  },
  timezone: 'America/Recife',
  current: {
    observedAt: '2026-10-20T14:00',
    temperatureC: 26.4,
    weatherCode: 2,
    humidityPercent: 76,
    windSpeedKmh: 14.8,
    pressureHpa: 1012.3,
    precipitationMm: 0.6,
  },
  forecast: [
    {
      date: '2026-10-20',
      temperatureMinC: 24.1,
      temperatureMaxC: 29.8,
      weatherCode: 2,
      precipitationTotalMm: 0.6,
      windSpeedMaxKmh: 23.4,
    },
    {
      date: '2026-10-21',
      temperatureMinC: 24.3,
      temperatureMaxC: 30.1,
      weatherCode: 3,
      precipitationTotalMm: 0,
      windSpeedMaxKmh: 21.6,
    },
    {
      date: '2026-10-22',
      temperatureMinC: 23.8,
      temperatureMaxC: 28.5,
      weatherCode: 61,
      precipitationTotalMm: 8.2,
      windSpeedMaxKmh: 27,
    },
    {
      date: '2026-10-23',
      temperatureMinC: 24,
      temperatureMaxC: 29.2,
      weatherCode: 80,
      precipitationTotalMm: 3.4,
      windSpeedMaxKmh: 25.2,
    },
    {
      date: '2026-10-24',
      temperatureMinC: 24.5,
      temperatureMaxC: 30.5,
      weatherCode: 0,
      precipitationTotalMm: 0,
      windSpeedMaxKmh: 19.8,
    },
  ],
};