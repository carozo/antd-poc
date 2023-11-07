import React, { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";

export const PlacesInfo = ({ location = "Montevideo" }) => {
  const parsedLocation = location ? location.replace(" ", "%20") : "new%20york";
  const [lon, setLon] = useState(0);
  const [lat, setLat] = useState(0);
  const [places, setPlaces] = useState(undefined);
  //podemos obtener la population de este endpoint si queremos
  const getCoordinates = async () => {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "1d2e6f93ffmsh8c8b3f9e90c8b9dp1eedffjsnb492286af8ee",
        "X-RapidAPI-Host": "opentripmap-places-v1.p.rapidapi.com",
      },
    };

    fetch(
      `https://opentripmap-places-v1.p.rapidapi.com/en/places/geoname?name=${parsedLocation}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setLon(response.lon);
        setLat(response.lat);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    getCoordinates();
  }, []);

  useEffect(() => {
    if (lon && lat) {
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "1a7f4089c7msh02e05f170f224f1p1bf205jsna77ef02288d3",
          "X-RapidAPI-Host": "opentripmap-places-v1.p.rapidapi.com",
        },
      };

      fetch(
        `https://opentripmap-places-v1.p.rapidapi.com/en/places/autosuggest?name=food&lon=${lon}&radius=50000&lat=${lat}&kinds=tourist_facilities&limit=8`,
        options
      )
        .then((response) => response.json())
        .then((response) => {
          setPlaces(response.features);
        })
        .catch((err) => console.error(err));
    }
  }, [lon, lat]);

  return (
    <div>
      {places ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <Row gutter={[16, 24]}>
            {places?.map((place) => (
              <Col className="gutter-row" span={6}>
                <RenderPlace place={place} />
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <Spin
          size={"large"}
          style={{ position: "absolute", top: "50%", right: "50%" }}
        />
      )}
    </div>
  );
};

const RenderPlace = ({ place }) => {
  const [placeInfo, setPlaceInfo] = useState({});
  const [image, setImage] = useState(undefined);
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "1a7f4089c7msh02e05f170f224f1p1bf205jsna77ef02288d3",
      "X-RapidAPI-Host": "opentripmap-places-v1.p.rapidapi.com",
    },
  };
  const optionsImage = {
    method: "GET",
  };
  const getPlaceDetails = async () => {
    const parsedLocation = place?.properties?.name?.replace(" ", "%20");
    fetch(
      `https://opentripmap-places-v1.p.rapidapi.com/en/places/xid/${place?.properties?.xid}`,
      options
    )
      .then((response) => response.json())
      .then((response) => setPlaceInfo(response))
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    getPlaceDetails();
  }, []);

  return (
    <>
      <Card
        title={place?.properties?.name}
        style={{ margin: 20 }}
        key={place.id}
      >
        {image ? (
          <img src={image} style={{ height: 30 }} />
        ) : (
          place?.geometry?.coordinates && (
            <img
              style={{
                height: 150,
                width: 150,
                marginLeft: 20,
                marginBottom: 20,
              }}
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${[
                ...place?.geometry?.coordinates,
              ]
                ?.reverse()
                .join(",")}&zoom=14&size=150x150&key=`}
            />
          )
        )}
        {placeInfo?.url && (
          <a
            target={"_blank"}
            href={placeInfo?.url}
            style={{
              flexDirection: "column",
              display: "flex",
            }}
            rel="noreferrer"
          >
            <p>Visit webpage</p>
            <div style={{ marginTop: "10px", flex: 1 }}>
              {React.createElement(ArrowRightOutlined)}
            </div>
          </a>
        )}
      </Card>
    </>
  );
};
