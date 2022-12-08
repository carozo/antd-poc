import React, { useEffect, useState, useCallback } from "react";
import { Card, Spin } from "antd";
import moment from "moment";

import "../info.scss";

export const CityWeather = (props) => {
  const [dailyForecasts, setDailyForecasts] = useState([]);
  const [currentForecast, setCurrentForecast] = useState();

  const mapCityCurrentForecast = (result) => {
    if (
      result.RealFeelTemperature &&
      result.Temperature &&
      result.Pressure &&
      result.Visibility &&
      result.PressureTendency
    ) {
      const mappedForecast = {
        generalText: result.WeatherText,
        realFeel: {
          temperature:
            result.RealFeelTemperature.Metric.Value +
            result.RealFeelTemperature.Metric.Unit,
          phrase: result.RealFeelTemperature.Metric.Phrase,
        },
        temperature: {
          temperature:
            result.Temperature.Metric.Value + result.Temperature.Metric.Unit,
        },
        hasPrecipitation: result.HasPrecipitation,
        humidity: result.RelativeHumidity + "%",
        pressure: {
          value: result.Pressure.Metric.Value + result.Pressure.Metric.Unit,
          phrase: result.PressureTendency.LocalizedText,
        },
        uv: {
          index: result.UVIndex,
          state: result.UVIndexText,
        },
        visibility:
          result.Visibility.Metric.Value + result.Visibility.Metric.Unit,
      };
      setCurrentForecast(mappedForecast);
    }
  };

  const mapCityForecast = (result) => {
    const mappedForecasts = result?.DailyForecasts?.map((forecast) => {
      return {
        date: moment(forecast.Date).format("dddd, Do MMM YYYY"),
        maximum:
          forecast.Temperature.Maximum.Value +
          forecast.Temperature.Maximum.Unit,
        minimum:
          forecast.Temperature.Minimum.Value +
          forecast.Temperature.Minimum.Unit,
        day: forecast.Day.IconPhrase,
        night: forecast.Night.IconPhrase,
      };
    });
    setDailyForecasts(mappedForecasts);
  };

  const getCityInfo = useCallback(async (result) => {
    const id = result && result.length > 0 ? result[0].Key : undefined;
    if (id) {
      var requestOptions = {
        method: "GET",
      };

      await fetch(
        `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${id}?apikey=o7JzrLb0UXIDfkXAopaEUhbIAdFO24Rq`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => mapCityForecast(result))
        .catch((error) => setDailyForecasts([]));

      await fetch(
        `http://dataservice.accuweather.com/currentconditions/v1/${id}?details=true&apikey=o7JzrLb0UXIDfkXAopaEUhbIAdFO24Rq`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => mapCityCurrentForecast(result[0]))
        .catch((error) => setCurrentForecast());
    }
  }, []);

  const getCityId = useCallback(async () => {
    var requestOptions = {
      method: "GET",
    };

    await fetch(
      `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=o7JzrLb0UXIDfkXAopaEUhbIAdFO24Rq&q=${props.queryString}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => getCityInfo(result))
      .catch((error) => {
        setCurrentForecast();
        setDailyForecasts([]);
      });
  }, [getCityInfo, props.queryString]);

  useEffect(() => {
    getCityId();
  }, [props.queryString, getCityId]);

  if (!dailyForecasts && !currentForecast) {
    return (
      <Spin
        size={"large"}
        style={{ position: "absolute", top: "50%", right: "50%" }}
      />
    );
  }

  return (
    <>
      {currentForecast && (
        <Card title="Now" style={{ marginTop: "20px" }}>
          <Card type="inner" title="Temperature">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <p>Status: {currentForecast.generalText}</p>
              <p>Temperature: {currentForecast.temperature.temperature}</p>
              <p>
                Real Feel: {currentForecast.realFeel.temperature}{" "}
                {currentForecast.realFeel.phrase}
              </p>
            </div>
          </Card>
          <Card style={{ marginTop: 16 }} type="inner" title="Other metrics">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <p>
                {currentForecast.hasPrecipitation
                  ? "Has precipitations"
                  : "Without precipitations"}
              </p>
              <p>
                UV Index: {currentForecast.uv.index} {currentForecast.uv.state}
              </p>
              <p>
                Pressure: {currentForecast.pressure.value}{" "}
                {currentForecast.pressure.phrase}
              </p>
              <p>Humidity: {currentForecast.humidity}</p>
              <p>Visibility: {currentForecast.visibility}</p>
            </div>
          </Card>
        </Card>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        {dailyForecasts.map((forecast) => (
          <Card
            title={forecast.date}
            style={{ width: 300 }}
            key={forecast.date}
          >
            <p>Day: {forecast.day}</p>
            <p>Night: {forecast.night}</p>
            <p>Maximum: {forecast.maximum}</p>
            <p>Minimum: {forecast.minimum}</p>
          </Card>
        ))}
      </div>
      {!currentForecast && dailyForecasts === [] && (
        <p>There is no information to show</p>
      )}
    </>
  );
};

export default CityWeather;
