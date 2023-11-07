import React, { useEffect, useState, useCallback } from "react";
import { Card, Col, Row, Spin } from "antd";
import moment from "moment";

import "../info.scss";

const imgStyle = {
  color: "#fff",
  textAlign: "center",
  borderRadius: "5px",
  width: "100%",
};

export const CityNews = (props) => {
  const [cityNews, setCityNews] = useState(undefined);

  const mapCityNews = (result) => {
    const mappedNews = result.articles?.map((article) => {
      return {
        title: article.title,
        description: article.description,
        author: article.author,
        date: moment(article.publishedAt).format("dddd, Do MMM YYYY"),
        image: article.urlToImage,
        link: article.url,
      };
    });
    setCityNews(mappedNews);
  };

  const getCityNews = useCallback(async () => {
    if (props.queryString) {
      var requestOptions = {
        method: "GET",
      };

      await fetch(
        `https://newsapi.org/v2/everything?q=${props.queryString}&pageSize=12&searchIn=title&apiKey=b76112c594e94991a4aab59bc252cd84`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => mapCityNews(result))
        .catch((error) => setCityNews([]));
    }
  }, [props.queryString]);

  useEffect(() => {
    getCityNews();
  }, [props.queryString, getCityNews]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "10px",
        height: "95%",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
      className="news-content"
    >
      {cityNews ? (
        <Row gutter={[16, 24]}>
          {cityNews.map((article) => (
            <Col className="gutter-row" span={6}>
              <Card
                title={article.title}
                style={{ width: 300 }}
                key={article.title}
              >
                <p>Date: {article.date}</p>
                <img style={imgStyle} src={article.image} alt={article.title} />
                <div
                  dangerouslySetInnerHTML={{ __html: article.description }}
                ></div>
                <p>Author: {article.author ? article.author : "unknown"}</p>
                <a href={article.link}>{article.link.split("/")[2]}</a>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Spin
          size={"large"}
          style={{ position: "absolute", top: "50%", right: "50%" }}
        />
      )}
    </div>
  );
};

export default CityNews;
