import { Card, Carousel, Rate } from "antd";
import React from "react";
import { useEffect } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";

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
  const [starRating, setStarRating] = React.useState(undefined);
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
    // if (false) {
    fetch("https://hotels4.p.rapidapi.com/properties/v2/detail", options)
      .then((response) => response.json())
      .then((response) => {
        setHotelDetail(response.data.propertyInfo);
        setImage(
          response.data.propertyInfo.propertyGallery.images[0].image.url
        );
        console.log(
          "hello",
          parseInt(
            response.data.propertyInfo?.reviewInfo?.summary
              ?.overallScoreWithDescriptionA11y?.value[0]
          ) / 2
        );
        setStarRating(
          parseInt(
            response.data.propertyInfo?.reviewInfo?.summary
              ?.overallScoreWithDescriptionA11y?.value[0]
          ) / 2
        );
      })
      .catch((err) => console.error(err));
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flex: 1,
      }}
    >
      <div
        style={{
          height: 250,
          width: "100%",
          display: "flex",
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
        <div
          style={{
            position: "absolute",
          }}
        >
          <h2
            style={{
              marginBottom: 0,
              marginTop: 30,
              fontSize: 50,
              color: "white",
              fontWeight: 300,
              backgroundColor: "#00000066",
              paddingLeft: 10,
              display: "inline-block",
            }}
          >
            {hotelDetail?.summary?.name}
          </h2>
          <br></br>
          <p
            style={{
              backgroundColor: "#e1edf7ee",
              marginTop: 10,
              color: "#303030",
              display: "inline-block",
              fontSize: 20,
              fontWeight: 200,
              paddingLeft: 10,
            }}
          >
            {hotelDetail?.summary?.tagline}
          </p>
        </div>
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
            marginTop: 10,
            display: "flex",
            flex: 1,
          }}
        >
          <div style={{ flexDirection: "column", flex: 1 }}>
            <p style={{ paddingLeft: 20, paddingRight: 5 }}>
              <strong>Location:</strong>{" "}
              {hotelDetail?.summary?.location?.address?.addressLine}
            </p>
            {hotelDetail && (
              <img
                style={{
                  height: 150,
                  width: 250,
                  marginLeft: 20,
                  marginBottom: 20,
                }}
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${hotelDetail?.summary?.location?.address?.addressLine},CA&zoom=14&size=250x150&key=AIzaSyApRU593he8LkibAe81HpViVIbgFPyxV3g`}
              />
            )}
          </div>
          <div style={{ flexDirection: "column", flex: 1 }}>
            <p style={{ paddingLeft: 20, fontWeight: 500, paddingRight: 5 }}>
              <strong>Score:</strong>{" "}
              {
                hotelDetail?.reviewInfo?.summary
                  ?.overallScoreWithDescriptionA11y?.value
              }
            </p>
            {starRating && (
              <Rate
                disabled
                defaultValue={starRating}
                style={{ marginLeft: 20 }}
              />
            )}
          </div>
          <div
            style={{
              flexDirection: "column",
              flex: 1,
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <Carousel
              autoplay
              style={{
                height: 200,
                width: 600,
                marginRight: 20,
              }}
            >
              {hotelDetail?.propertyGallery?.images[1]?.image.url && (
                <div>
                  <img
                    src={hotelDetail?.propertyGallery?.images[1]?.image.url}
                    style={{ objectFit: "cover", height: 200, width: "100%" }}
                  />
                </div>
              )}
              {hotelDetail?.propertyGallery?.images[2]?.image.url && (
                <div>
                  <img
                    src={hotelDetail?.propertyGallery?.images[2]?.image.url}
                    style={{ objectFit: "cover", height: 200, width: "100%" }}
                  />
                </div>
              )}
              {hotelDetail?.propertyGallery?.images[3]?.image.url && (
                <div>
                  <img
                    src={hotelDetail?.propertyGallery?.images[3]?.image.url}
                    style={{ objectFit: "cover", height: 200, width: "100%" }}
                  />
                </div>
              )}
              {hotelDetail?.propertyGallery?.images[4]?.image.url && (
                <div>
                  <img
                    src={hotelDetail?.propertyGallery?.images[4]?.image.url}
                    style={{ objectFit: "cover", height: 200, width: "100%" }}
                  />
                </div>
              )}
              {hotelDetail?.propertyGallery?.images[5]?.image.url && (
                <div>
                  <img
                    src={hotelDetail?.propertyGallery?.images[5]?.image.url}
                    style={{ objectFit: "cover", height: 200, width: "100%" }}
                  />
                </div>
              )}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};
