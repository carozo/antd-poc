import React, { useEffect, useState, useCallback } from 'react';
import { Card, Carousel, Col, Row } from 'antd';
import moment from 'moment';

import './info.scss';

const contentStyle = {
  color: '#fff',
  textAlign: 'center',
  borderRadius: '5px',
};
const imgStyle = {
  color: '#fff',
  textAlign: 'center',
  borderRadius: '5px',
  width: '100%',
};

export const CityInformation = (props) => {
  const [dailyForecasts, setDailyForecasts] = useState([]);
  const [currentForecast, setCurrentForecast] = useState();
  const [cityPictures, setCityPictures] = useState([]);
  const [cityNews, setCityNews] = useState([]);
  const [cityName, setCityName] = useState(props.queryString);

  const mapCityCurrentForecast = (result) => {
    if (result.RealFeelTemperature && result.Temperature && result.Pressure && result.Visibility && result.PressureTendency) {
      const mappedForecast =  {
        generalText: result.WeatherText,
        realFeel: {
        temperature: result.RealFeelTemperature.Metric.Value + result.RealFeelTemperature.Metric.Unit,
        phrase: result.RealFeelTemperature.Metric.Phrase,
      },
      temperature: {
        temperature: result.Temperature.Metric.Value + result.Temperature.Metric.Unit,
      },
      hasPrecipitation: result.HasPrecipitation,
      humidity: result.RelativeHumidity + '%',
      pressure: {
        value: result.Pressure.Metric.Value + result.Pressure.Metric.Unit,
        phrase: result.PressureTendency.LocalizedText,
      },
      uv: {
        index: result.UVIndex,
        state: result.UVIndexText,
      },
      visibility: result.Visibility.Metric.Value + result.Visibility.Metric.Unit,
      };
      setCurrentForecast(mappedForecast);
    }
  }

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

  const mapCityNews = (result) => {
    const mappedNews = result.articles?.map((article) => {
      return {
        title: article.title,
        description: article.description,
        author: article.author,
        date: moment(article.publishedAt).format("dddd, Do MMM YYYY"),
        image: article.urlToImage,
        link: article.url,
      }
    });
    setCityNews(mappedNews);
  }

  const getCityInfo = useCallback(async (result) => {
    const id = (result && result.length > 0) ? result[0].Key : undefined;
    if (id) {
      var requestOptions = {
        method: 'GET',
      };
      
      await fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${id}?apikey=o7JzrLb0UXIDfkXAopaEUhbIAdFO24Rq`, requestOptions)
      .then(response => response.json())
      .then(result => mapCityForecast(result))
      .catch(error => setDailyForecasts([]));
      
      await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${id}?details=true&apikey=o7JzrLb0UXIDfkXAopaEUhbIAdFO24Rq`, requestOptions)
      .then(response => response.json())
      .then(result => mapCityCurrentForecast(result[0]))
      .catch(error => setCurrentForecast());
    }
  }, []);

  const getCityId = useCallback(async () => {
    var requestOptions = {
      method: 'GET',
    };

    await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=o7JzrLb0UXIDfkXAopaEUhbIAdFO24Rq&q=${props.queryString}`, requestOptions)
    .then(response => response.json())
    .then(result => getCityInfo(result))
    .catch(error => {
      setCurrentForecast();
      setDailyForecasts([]);
    });
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
      .catch(error => setCityPictures([]));
    }
  }, [props.queryString]);

  const getCityNews = useCallback(async () => {
    if (props.queryString) {
      var requestOptions = {
        method: 'GET',
      };
      
      await fetch(`https://newsapi.org/v2/everything?q=${props.queryString}&pageSize=12&searchIn=title&apiKey=b76112c594e94991a4aab59bc252cd84`, requestOptions)
      .then(response => response.json())
      .then(result => mapCityNews(result))
      .catch(error => setCityNews([]));
    }
  }, [props.queryString]);

  useEffect(() => {
    getCityId();
    getCityPictures();
    getCityNews();
    setCityName(props.queryString);
  }, [props.queryString, getCityId, getCityNews, getCityPictures])

  return (
    <div style={{ height: '100%' }}>
      <label style={{ fontSize: '30px' }}>{cityName}</label>
      {props.menuShowed === 'images' ? (
        <Carousel style={{ marginTop: '20px' }}>
          {cityPictures.map((picture) => (
            <div key={picture.alt}>
              <img style={contentStyle} src={picture.url} alt={picture.alt} />
            </div>
          ))}
        </Carousel>
      ) : props.menuShowed === 'weather' ? (
        <>
          {currentForecast && (
            <Card title="Now" style={{ marginTop: '20px' }}>
              <Card type="inner" title="Temperature">
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                  <p>Status: {currentForecast.generalText}</p>
                  <p>Temperature: {currentForecast.temperature.temperature}</p>
                  <p>Real Feel: {currentForecast.realFeel.temperature} {currentForecast.realFeel.phrase}</p>
                </div>
              </Card>
              <Card
                style={{ marginTop: 16 }}
                type="inner"
                title="Other metrics"
              >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
                  <p>{currentForecast.hasPrecipitation ? 'Has precipitations' : 'Without precipitations'}</p>
                  <p>UV Index: {currentForecast.uv.index} {currentForecast.uv.state}</p>
                  <p>Pressure: {currentForecast.pressure.value} {currentForecast.pressure.phrase}</p>
                  <p>Humidity: {currentForecast.humidity}</p>
                  <p>Visibility: {currentForecast.visibility}</p>
                </div>
              </Card>
            </Card> 
          )}
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '20px' }}>
            {dailyForecasts.map((forecast) => (
              <Card title={forecast.date} style={{ width: 300 }} key={forecast.date}>
                <p>Day: {forecast.day}</p>
                <p>Night: {forecast.night}</p>
                <p>Maximum: {forecast.maximum}</p>
                <p>Minimum: {forecast.minimum}</p>
              </Card>
            ))}
          </div>
          {!currentForecast && dailyForecasts === [] && <p>There is no information to show</p>}
        </>
      ) : props.menuShowed === 'news' && (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px', height: '95%', overflowY: 'scroll', overflowX: 'hidden' }} className="news-content">
          <Row gutter={[16, 24]}>
            {cityNews.map((article) => (
              <Col className="gutter-row" span={6}>
                <Card title={article.title} style={{ width: 300 }} key={article.title}>
                  <p>Date: {article.date}</p>
                  <img style={imgStyle} src={article.image} alt={article.title} />
                  <p>{article.description}</p>
                  <p>Author: {article.author ? article.author : 'unknown'}</p>
                  <a href={article.link}>{article.link.split('/')[2]}</a>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  )
}

export default CityInformation;