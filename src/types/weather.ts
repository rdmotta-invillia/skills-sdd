/**
 * Contratos de domínio compartilhados do Weather App.
 *
 * Decisão de arquitetura: as temperaturas são sempre armazenadas em Celsius
 * internamente e convertidas apenas na camada de apresentação. Assim, a troca
 * de unidade (C/F) nunca dispara um novo request.
 */

export type Unit = 'celsius' | 'fahrenheit';

/** Resultado da API de geocoding (uma cidade). */
export interface City {
  id: number;
  name: string;
  country: string;
  /** Estado/região, quando disponível (ajuda a desambiguar homônimos). */
  region?: string;
  latitude: number;
  longitude: number;
}

/** Condições atuais. Temperatura sempre em °C. */
export interface CurrentWeather {
  observedAt: string;
  temperatureC: number | null;
  weatherCode: number | null;
  humidityPercent: number | null;
  windSpeedKmh: number | null;
  pressureHpa: number | null;
  precipitationMm: number | null;
}

/** Um dia da previsão. Temperaturas sempre em °C. */
export interface ForecastDay {
  date: string;
  temperatureMinC: number | null;
  temperatureMaxC: number | null;
  weatherCode: number | null;
  precipitationTotalMm: number | null;
  windSpeedMaxKmh: number | null;
}

/** Agregado entregue à UI: cidade + clima atual + 5 dias de previsão. */
export interface WeatherData {
  city: City;
  timezone: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
}

export interface LegacyCity extends City {
  admin1?: string;
}

export interface LegacyCurrentWeather {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  precipitation: number;
  time: string;
}

export interface LegacyForecastDay {
  date: string;
  min: number;
  max: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface LegacyWeatherData {
  city: LegacyCity;
  current: LegacyCurrentWeather;
  forecast: LegacyForecastDay[];
}
