import React, { useEffect, useState, useCallback } from 'react';
import { Card } from 'antd';
import moment from 'moment';

export const CityInformation = (props) => {
  const [dailyForecasts, setDailyForecasts] = useState([]);
  const [cityName, setCityName] = useState('');

  const mapCityForecast = (result) => {
    const mappedForecasts = result?.DailyForecasts?.map((forecast) => {
      return {
        date: moment(forecast.Date).format("dddd, Do MMM YYYY"),
        maximum: forecast.Temperature.Maximum.Value + forecast.Temperature.Maximum.Unit,
        minimum: forecast.Temperature.Minimum.Value + forecast.Temperature.Minimum.Unit,
        day: forecast.Day.IconPhrase,
        night: forecast.Night.IconPhrase,
      }
    });
    setDailyForecasts(mappedForecasts);
  }

  const getCityInfo = useCallback(async (result) => {
    const id = (result && result.length > 0) ? result[0].Key : undefined;
    if (id) {
      var requestOptions = {
        method: 'GET',
      };
      
      await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${id}?apikey=qUbtmRrCaASACQZZR3RrHLqkGcUwd6Tc`, requestOptions)
      .then(response => response.json())
      .then(result => mapCityForecast(result))
      .catch(error => console.log('error', error));
    }
  }, []);

  const getCityId = useCallback(async () => {
    var requestOptions = {
      method: 'GET',
    };

    await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=qUbtmRrCaASACQZZR3RrHLqkGcUwd6Tc&q=${props.queryString}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      getCityInfo(result);
      setCityName( result && result[0].LocalizedName ? result[0]?.LocalizedName : '');
    })
    .catch(error => console.log('error', error));
  }, [getCityInfo, props.queryString]);

  useEffect(() => {
    getCityId();
  }, [props.queryString, getCityId])

  return (
    <div>
      <label style={{ fontSize: '30px' }}>{cityName}</label>
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