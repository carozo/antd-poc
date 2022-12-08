import React, { useEffect, useState, useCallback } from "react";
import { Carousel, Spin } from "antd";

import "../info.scss";

const contentStyle = {
  color: "#fff",
  textAlign: "center",
  borderRadius: "5px",
};

export const CityPictures = (props) => {
  const [cityPictures, setCityPictures] = useState([]);

  const mapCityPictures = (pictures) => {
    const mappedPictures = pictures?.map((picture) => {
      return {
        url: picture.src.large,
        alt: picture.alt,
      };
    });
    setCityPictures(mappedPictures);
  };

  const getCityPictures = useCallback(async () => {
    if (props.queryString) {
      var requestOptions = {
        method: "GET",
        headers: [
          [
            "Authorization",
            "563492ad6f91700001000001b975cb45097049aa8704c1f12016b015",
          ],
        ],
      };

      await fetch(
        `https://api.pexels.com/v1/search?query=${props.queryString}&per_page=10&width=600&height=400`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => mapCityPictures(result.photos))
        .catch((error) => setCityPictures([]));
    }
  }, [props.queryString]);

  useEffect(() => {
    getCityPictures();
  }, [props.queryString, getCityPictures]);

  if (!cityPictures) {
    return (
      <Spin
        size={"large"}
        style={{ position: "absolute", top: "50%", right: "50%" }}
      />
    );
  }

  return (
    <Carousel style={{ marginTop: "20px" }}>
      {cityPictures.map((picture) => (
        <div key={picture.alt}>
          <img style={contentStyle} src={picture.url} alt={picture.alt} />
        </div>
      ))}
    </Carousel>
  );
};

export default CityPictures;
