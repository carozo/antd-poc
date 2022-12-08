import React, { useEffect, useState } from "react";
import { CityNews } from "./news/CityNews";
import { CityWeather } from "./weather/CityWeather";
import { CityPictures } from "./pictures/CityPictures";
import { HotelInfo } from "../hotelInfo/HotelInfo";
import { PlacesInfo } from "../placesInfo/PlacesInfo";

import "./info.scss";

export const CityInformation = (props) => {
  const [cityName, setCityName] = useState(props.queryString);

  useEffect(() => {
    setCityName(props.queryString);
  }, [props.queryString]);

  return (
    <div style={{ height: "100%" }}>
      <label style={{ fontSize: "30px" }}>{cityName}</label>
      {props.menuShowed === "images" ? (
        <CityPictures queryString={cityName} />
      ) : props.menuShowed === "weather" ? (
        <CityWeather queryString={cityName} />
      ) : props.menuShowed === "news" ? (
        <CityNews queryString={cityName} />
      ) : props.menuShowed === "hotels" ? (
        <HotelInfo location={cityName} />
      ) : (
        props.menuShowed === "restaurants" && <PlacesInfo location={cityName} />
      )}
    </div>
  );
};

export default CityInformation;
