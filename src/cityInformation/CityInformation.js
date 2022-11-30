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

export const HotelInfo = () => {
  const getHotels = async () => {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '1a7f4089c7msh02e05f170f224f1p1bf205jsna77ef02288d3',
        'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
      }
    };

    fetch('https://hotels4.p.rapidapi.com/locations/v2/search?query=new%20york&locale=en_US&currency=USD', options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err));

  };
  useEffect(() => {
    getHotels();
  }, []);
  return (
    <div>
      <label style={{ fontSize: "30px" }}>Montevideo</label>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        {[].map((forecast) => (
          <Card title={"a"} style={{ width: 300 }} key={1}></Card>
        ))}
      </div>
    </div>
  );
};
