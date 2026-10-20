import { describe, expect, it } from 'vitest';
import { mockWeatherData } from '../../src/mocks/weatherData';

describe('mockWeatherData', () => {
  it('fornece cidade, fuso e condicoes atuais para a UI', () => {
    expect(mockWeatherData.city).toMatchObject({
      name: 'Recife',
      country: 'Brasil',
      region: 'Pernambuco',
    });
    expect(mockWeatherData.timezone).toBe('America/Recife');
    expect(mockWeatherData.current).toEqual({
      observedAt: '2026-10-20T14:00',
      temperatureC: 26.4,
      weatherCode: 2,
      humidityPercent: 76,
      windSpeedKmh: 14.8,
      pressureHpa: 1012.3,
      precipitationMm: 0.6,
    });
  });

  it('fornece cinco datas consecutivas e medidas diarias coerentes', () => {
    expect(mockWeatherData.forecast.map((day) => day.date)).toEqual([
      '2026-10-20',
      '2026-10-21',
      '2026-10-22',
      '2026-10-23',
      '2026-10-24',
    ]);

    for (const day of mockWeatherData.forecast) {
      expect(day.temperatureMinC).not.toBeNull();
      expect(day.temperatureMaxC).not.toBeNull();
      expect(day.temperatureMinC).toBeLessThanOrEqual(day.temperatureMaxC as number);
      expect(day.precipitationTotalMm).toBeGreaterThanOrEqual(0);
      expect(day.windSpeedMaxKmh).toBeGreaterThanOrEqual(0);
    }
    expect(mockWeatherData.forecast.some((day) => day.precipitationTotalMm === 0)).toBe(true);
  });
});