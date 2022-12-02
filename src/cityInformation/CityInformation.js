import React, { useEffect, useState, useCallback } from 'react';
import { Card, Carousel } from 'antd';
import moment from 'moment';

const contentStyle = {
  color: '#fff',
  textAlign: 'center',
  borderRadius: '5px',
};

export const CityInformation = (props) => {
  const [dailyForecasts, setDailyForecasts] = useState([]);
  const [cityPictures, setCityPictures] = useState([]);
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

  const mapCityPictures = (pictures) => {
    const mappedPictures = pictures?.map((picture) => {
      return {
        url: picture.src.large,
        alt: picture.alt
      }
    });
    setCityPictures(mappedPictures);
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

  const getCityPictures = useCallback(async () => {
    if (props.queryString) {
      var requestOptions = {
        method: 'GET',
        headers: [['Authorization','563492ad6f91700001000001b975cb45097049aa8704c1f12016b015' ]],
      };
      
      await fetch(`https://api.pexels.com/v1/search?query=${props.queryString}&per_page=10&width=600&height=400`, requestOptions)
      .then(response => response.json())
      .then(result => mapCityPictures(result.photos))
      .catch(error => console.log('error', error));
    }
  }, [props.queryString]);

  useEffect(() => {
    getCityId();
    getCityPictures();
  }, [props.queryString, getCityId])

  return (
    <div>
      <label style={{ fontSize: '30px' }}>{cityName}</label>
      {props.menuShowed === 'images' ? (
        <Carousel style={{ marginTop: '10px' }}>
          {cityPictures.map((picture) => (
            <div key={picture.alt}>
              <img style={contentStyle} src={picture.url} alt={picture.alt} />
            </div>
          ))}
        </Carousel>
      ) : props.menuShowed === 'weather' && (
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
      )}
    </div>
  )
}

export default CityInformation;