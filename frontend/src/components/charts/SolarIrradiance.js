import axios from 'axios';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

function SolarIrradiance() {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Solar Irradiance (W/m²)',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(146, 205, 182, 0.5)',
      },
    ],
  });

  useEffect(() => {
    var fetch = 0;
    const maxDataPoints = 10;

    const fetchData = () => {
      axios
        .get('/api/users/der-data/sql')
        .then((res) => {
          // generate random number between 0 and 100
          //const newDataPoint = Math.floor(Math.random() * 100);

          const newDataPoint = res.data.data.solar_irradiance;

          // Update the state with the new data point
          setData((prevData) => {
            const newData = [...prevData, newDataPoint];
            return newData.slice(Math.max(newData.length - maxDataPoints, 0));
          });

          // Update the chart data
          setChartData((prevChartData) => ({
            ...prevChartData,
            labels: [...prevChartData.labels.slice(-maxDataPoints), `Fetch ${fetch++}`],
            datasets: [
              {
                ...prevChartData.datasets[0],
                data: [...prevChartData.datasets[0].data.slice(-maxDataPoints), newDataPoint],
              },
            ],
          }));

        })
        .catch((error) => {
          console.log(error);
        });
    };

    // Fetch data initially
    fetchData();

    // Set up an interval to fetch data every 10 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000); // 10000 milliseconds = 10 seconds

    // Cleanup when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Watts/meters²',
          font: {
            size: 20,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Fetches',
          font: {
            size: 20,
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default SolarIrradiance;
