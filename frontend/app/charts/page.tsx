'use server';

import { management, auth0 } from '@/lib/auth0';
import { unauthorized } from 'next/navigation';
import {
  createAveragePricePerNeighbourhoodData,
  createActiveListingsPerNeighbourhoodData,
  createReviewsPerMonthData,
  createAverageReviewsPerMonthPerNeighbourhoodData,
  createRoomTypesData,
} from '@/lib/charts';
import { BarChart, LineChart, PieChart } from '@/components/charts';

const Charts = async () => {
  const session = await auth0.getSession();
  const user = session?.user;

  const rolesResponse = await management.users.getRoles({
    id: user?.sub || '',
  });
  const roles = Array.isArray(rolesResponse.data)
    ? rolesResponse.data.map((role: { name: string }) => role.name)
    : [];

  if (!roles.includes('Admin')) unauthorized();

  const averagePricePerNeighbourhoodData =
    await createAveragePricePerNeighbourhoodData();
  const activeListingsPerNeighbourhoodData =
    await createActiveListingsPerNeighbourhoodData();
  const reviewsPerMonthData = await createReviewsPerMonthData();
  const averageReviewsPerMonthPerNeighbourhoodData =
    await createAverageReviewsPerMonthPerNeighbourhoodData();
  const roomTypesData = await createRoomTypesData();

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: false },
    },
  };

  return (
    <main className="grid w-full grid-cols-1 gap-x-8 gap-y-12 p-4 px-8 md:px-20 lg:grid-cols-2 xl:grid-cols-3">
      {averagePricePerNeighbourhoodData && (
        <div className="relative h-96 w-full">
          <BarChart
            title="Average Price per Neighbourhood"
            data={averagePricePerNeighbourhoodData}
            options={commonOptions}
          />
        </div>
      )}
      {activeListingsPerNeighbourhoodData && (
        <BarChart
          title="Active Listings per Neighbourhood"
          data={activeListingsPerNeighbourhoodData}
          options={commonOptions}
        />
      )}
      {reviewsPerMonthData && (
        <LineChart
          title="Reviews per Month"
          data={reviewsPerMonthData}
          options={commonOptions}
        />
      )}
      {averageReviewsPerMonthPerNeighbourhoodData && (
        <BarChart
          title="Average Reviews per Month per Neighbourhood"
          data={averageReviewsPerMonthPerNeighbourhoodData}
          options={commonOptions}
        />
      )}
      {roomTypesData && (
        <PieChart
          title="Room Types"
          data={roomTypesData}
          options={commonOptions}
        />
      )}
    </main>
  );
};

export default Charts;
