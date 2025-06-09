'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

import { ChartOptions, ChartData } from 'chart.js';

type BarChartProps = {
  title: string;
  options: ChartOptions<'bar'>;
  data: ChartData<'bar'>;
};

export const BarChart = ({ title, options, data }: BarChartProps) => {
  return (
    <div className="relative h-96 w-full">
      <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
      <Bar data={data} options={options} />
    </div>
  );
};
