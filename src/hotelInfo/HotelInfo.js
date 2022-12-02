import { Card } from "antd";
import React from "react";
import { useEffect } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import {
  NotificationOutlined,
  HomeOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

export const HotelInfo = ({ location }) => {
  const parsedLocation = location ? location.replace(" ", "%20") : "new%20york";

  const [hotels, setHotels] = React.useState([]);
  const [showList, setShowList] = React.useState(true);
  const [currentHotelId, setCurrentHotelId] = React.useState(0);
  console.log(currentHotelId, "currentHotelId");
  console.log(hotels, "hotels");
  const getHotels = async () => {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "1d2e6f93ffmsh8c8b3f9e90c8b9dp1eedffjsnb492286af8ee",
        "X-RapidAPI-Host": "hotels4.p.rapidapi.com",
      },
    };

    fetch(
      "https://hotels4.p.rapidapi.com/locations/v2/search?query=new%20york&locale=en_US&currency=USD",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setHotels(response.suggestions[1].entities);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    getHotels();
  }, []);
  return (
    <>
      {showList ? (
        <div style={{ width: "100%" }}>
          <label style={{ fontSize: "30px", paddingLeft: "20px" }}>
            {location?.toUppercase() ?? "New york"}
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: "10px",
            }}
          >
            {hotels.map((hotel) => (
              <Card title={hotel.name} style={{ margin: 20 }} key={hotel.geoId}>
                <div
                  onClick={() => {
                    setShowList(false);
                    setCurrentHotelId(hotel.geoId);
                  }}
                  style={{
                    flexDirection: "row",
                    display: "flex",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: hotel.caption }}
                  ></div>
                  <div style={{ marginTop: "10px", flex: 1 }}>
                    {React.createElement(ArrowRightOutlined)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "white",
            display: "flex",
            flex: 1,
            marginLeft: 30,
            borderRadius: 5,
          }}
        >
          <HotelDetail currentHotelId={currentHotelId} />
        </div>
      )}
    </>
  );
};

const HotelDetail = ({ currentHotelId }) => {
  const [image, setImage] = React.useState("");
  const [hotelDetail, setHotelDetail] = React.useState(null);
  const [map, setMap] = React.useState();
  useEffect(() => {
    if (hotelDetail) {
      fetch(
        `https://maps.googleapis.com/maps/api/staticmap?center=${hotelDetail?.summary?.location?.address?.addressLine},CA&zoom=14&size=400x400&key=AIzaSyApRU593he8LkibAe81HpViVIbgFPyxV3g`
      )
        .then((response) => response.json())
        .then((response) => console.log(response))
        .then((response) => {
          setMap(response.url);
        });
    }
  }, [hotelDetail]);
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "1d2e6f93ffmsh8c8b3f9e90c8b9dp1eedffjsnb492286af8ee",
      "X-RapidAPI-Host": "hotels4.p.rapidapi.com",
    },
    body: `{"currency":"USD","eapid":1,"locale":"en_US","siteId":300000001,"propertyId":"${currentHotelId}"}`,
  };
  if (!hotelDetail) {
    fetch("https://hotels4.p.rapidapi.com/properties/v2/detail", options)
      .then((response) => response.json())
      .then((response) => {
        setHotelDetail(response.data.propertyInfo);
        setImage(
          response.data.propertyInfo.propertyGallery.images[0].image.url
        );
      })
      .catch((err) => console.error(err));
  }
  console.log(hotelDetail, "detai", image);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <div
        style={{
          height: "50%",
          width: "100%",
          display: "flex",
          backgroundColor: "orange",
        }}
      >
        {image && (
          <img
            src={image}
            alt="hotel"
            style={{
              width: "100%",
              objectFit: "cover",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}
          />
        )}
        <h1
          style={{
            position: "absolute",
            fontSize: 50,
            color: "white",
            fontWeight: 300,
            backgroundColor: "#00000066",
            paddingLeft: 10,
          }}
        >
          {hotelDetail?.summary?.name}
        </h1>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            padding: 10,
          }}
        >
          <p style={{ paddingLeft: 20, paddingRight: 5 }}>
            <strong>Location:</strong>{" "}
            {hotelDetail?.summary?.location?.address?.addressLine}
          </p>
          {hotelDetail && (
            <img
              style={{ height: 200, width: 200, marginLeft: 20 }}
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${hotelDetail?.summary?.location?.address?.addressLine},CA&zoom=14&size=200x200&key=AIzaSyApRU593he8LkibAe81HpViVIbgFPyxV3g`}
            />
          )}
          <p style={{ paddingLeft: 20, fontWeight: 500, paddingRight: 5 }}>
            <strong>Score:</strong>{" "}
            {
              hotelDetail?.reviewInfo?.summary?.overallScoreWithDescriptionA11y
                ?.value
            }
          </p>
        </div>
      </div>
    </div>
  );
};
