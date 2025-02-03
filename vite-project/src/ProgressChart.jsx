import React from "react";
import { Doughnut } from "react-chartjs-2";

const ProgressChart = ({ completed, total }) => {
  const data = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [completed, total - completed],
        backgroundColor: ["#007bff", "#e0e0e0"],
      },
    ],
  };

  return <Doughnut data={data} />;
};

export default ProgressChart;