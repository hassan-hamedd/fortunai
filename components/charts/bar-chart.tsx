"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue",
      data: [65000, 70000, 68000, 75000, 80000, 85000],
      backgroundColor: "hsl(var(--chart-1))",
    },
    {
      label: "Expenses",
      data: [35000, 38000, 36000, 40000, 42000, 45000],
      backgroundColor: "hsl(var(--chart-2))",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export function BarChart() {
  return <Bar data={data} options={options} />;
}