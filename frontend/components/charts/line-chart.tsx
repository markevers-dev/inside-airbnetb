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

import { Line } from 'react-chartjs-2';

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

type LineChartProps = {
  title: string;
  options: ChartOptions<'line'>;
  data: ChartData<'line'>;
};

export const LineChart = ({ title, options, data }: LineChartProps) => {
  return (
    <div className="relative h-96 w-full">
      <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
      <Line data={data} options={options} />
    </div>
  );
};
