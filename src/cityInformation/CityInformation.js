import React, { useEffect, useState } from 'react';
import { Card } from 'antd';

export const CityInformation = () => {
  const [dailyForecasts, setDailyForecasts] = useState([]);

  const mapCityForecast = (result) => {
    const mappedForecasts = result.DailyForecasts.map((forecast) => {
      return {
        date: forecast.Date,
        maximum: forecast.Temperature.Maximum.Value + forecast.Temperature.Maximum.Unit,
        minimum: forecast.Temperature.Minimum.Value + forecast.Temperature.Minimum.Unit,
        day: forecast.Day.IconPhrase,
        night: forecast.Night.IconPhrase,
      }
    });
    setDailyForecasts(mappedForecasts);
  }

  const getCityInfo = async () => {
    var requestOptions = {
      method: 'GET',
    };

    await fetch("http://dataservice.accuweather.com/forecasts/v1/daily/5day/349269?apikey=qUbtmRrCaASACQZZR3RrHLqkGcUwd6Tc", requestOptions)
    .then(response => response.json())
    .then(result => mapCityForecast(result))
    .catch(error => console.log('error', error));
  }

  useEffect(() => {
    getCityInfo();
  }, [])

  return (
    <div>
      <label style={{ fontSize: '30px' }}>Montevideo</label>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
        {dailyForecasts.map((forecast) => (
          <Card title={forecast.date} style={{ width: 300 }} key={forecast.date}>
            <p>Day: {forecast.day}</p>
            <p>Night: {forecast.night}</p>
            <p>Maximum: {forecast.maximum}</p>
            <p>Minimum: {forecast.minimum}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CityInformation;