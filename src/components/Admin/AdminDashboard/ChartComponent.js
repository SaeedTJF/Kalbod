import React, { useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";

const ChartComponent = ({ title, labelText, chartData, x_label, y_label, fillColor, lineColor }) => {

  console.log(" in chart component ", chartData)
  const [data, setData] = useState(chartData);

  useEffect(() => {
    setData(chartData);
  }, [chartData]);

  const options = {
    data: data,
    title: {
      text: title,
    },
    footnote: {
      text: "Source: Department for Business, Energy & Industrial Strategy",
    },
    series: [
      {
        type: "line",
        xKey: "x",
        yKey: labelText,
        stroke: lineColor,
        marker: {
          fill: fillColor,
          stroke: lineColor,
        },

        tooltip: {
          renderer: ({ datum, xKey, yKey }) => ({
            title: `X: ${datum[xKey]}`,
            content: `Value: ${datum[yKey]}`,
          }),
        },
      },
    ],
    axes: [
      {
        position: "bottom",
        type: "number",
        title: {
          text: x_label,
        },
        label: {
          format: (value) => `${value}`,
        },
        tick: {
          interval: 5,
        },
        min: 0,
        max: 60,
      },
      {
        position: "left",
        type: "number",
        title: {
          text: y_label,
        },
        tick: {
          interval: 5,
        },
        label: {
          format: (params) => `${params.value} %`,
        },
        min: 0,
        max: 100,
      },
    ],
  };

  return <AgCharts options={options} />;
};

export default ChartComponent;
