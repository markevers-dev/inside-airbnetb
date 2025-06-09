'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

import { ChartOptions, ChartData } from 'chart.js';

type PieChartProps = {
  title: string;
  options: ChartOptions<'pie'>;
  data: ChartData<'pie'>;
};

export const PieChart = ({ title, options, data }: PieChartProps) => {
  return (
    <div className="relative h-96 w-full">
      <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
      <Pie data={data} options={options} />
    </div>
  );
};
