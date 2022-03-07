import React, { useEffect, useState } from "react";

import { Col, Row, Typography } from "antd";
/* import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"; */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const LineChart = ({ currentPrice, coinName, coinId, timePeriod }) => {
  const [response, setResponse] = useState();

  const queryOptions = {
    method: "GET",
    url: `https://coinranking1.p.rapidapi.com/coin/${coinId}/history`,
    params: { referenceCurrencyUuid: "yhjMzLPhuIDl", timePeriod: timePeriod },
    headers: {
      "x-rapidapi-host": "coinranking1.p.rapidapi.com",
      "x-rapidapi-key": "15b844157fmsh076e1c8f19ecb82p1d2275jsn9b5566db6004",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(queryOptions.url, {
          params: {
            referenceCurrencyUuid: "yhjMzLPhuIDl",
            timePeriod: timePeriod,
          },
          headers: {
            "x-rapidapi-host": "coinranking1.p.rapidapi.com",
            "x-rapidapi-key":
              "15b844157fmsh076e1c8f19ecb82p1d2275jsn9b5566db6004",
          },
        });
        setResponse(response);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [queryOptions.url, timePeriod]);

  const coinPrice = [];
  const coinTimestamp = [];

  for (let i = 0; i < response?.data?.history?.length; i += 1) {
    coinPrice.push(response?.data?.history[i].price);
    coinTimestamp.push(
      new Date(response?.data?.history[i].timestamp * 1000).toLocaleDateString()
    );
  }

  const data = {
    labels: coinTimestamp,
    datasets: [
      {
        label: "Price In USD",
        data: coinPrice,
        fill: false,
        backgroundColor: "#0071bd",
        borderColor: "#0071bd",
      },
    ],
  };

  const options = {
    scales: {
      yAxis: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <>
      <Row className="chart-header">
        <Typography.Title level={2} className="chart-title">
          {coinName} Price Chart
        </Typography.Title>

        <Col className="price-container">
          <Typography.Title level={5} className="price-change">
            % {response?.data?.change}
          </Typography.Title>
          <Typography.Title level={5} className="current-price">
            Current {coinName} Price: ${currentPrice}
          </Typography.Title>
        </Col>
      </Row>
      <Line data={data} options={options} />
    </>
  );
};

export default LineChart;
