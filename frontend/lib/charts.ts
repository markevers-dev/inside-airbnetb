'use server';

import {
  fetchAveragePricePerNeighbourhood,
  fetchAverageReviewsPerMonthPerNeighbourhood,
  fetchReviewsPerMonth,
  fetchActiveListingsPerNeighbourhood,
  fetchRoomTypes,
} from '@/queries/charts';
import { auth0 } from './auth0';

/**
 * Generates chart data for average price per neighbourhood.
 * Fetches average price data and formats it for charting libraries.
 *
 * @returns {Promise<{ labels: string[], datasets: any[] }>} Chart data object with labels and datasets.
 */
export const createAveragePricePerNeighbourhoodData = async (): Promise<{
  labels: string[];
  datasets: any[];
}> => {
  const accessToken = await auth0.getAccessToken();
  if (!accessToken) throw new Error('No access token found');
  const averagePricePerNeighbourhood = await fetchAveragePricePerNeighbourhood(
    accessToken.token,
  );
  return {
    labels: averagePricePerNeighbourhood.map(
      (item: { neighbourhood: string }) => item.neighbourhood,
    ),
    datasets: [
      {
        label: 'Average Price (in $)',
        data: averagePricePerNeighbourhood.map(
          (item: { averagePrice: number }) =>
            parseFloat(item.averagePrice.toFixed(2)),
        ),
        backgroundColor: '#ff0000',
        borderColor: '#000000',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };
};

/**
 * Generates chart data for active listings per neighbourhood.
 * Fetches active listings data and formats it for charting libraries.
 *
 * @returns {Promise<{ labels: string[], datasets: any[] }>} Chart data object with labels and datasets.
 */
export const createActiveListingsPerNeighbourhoodData = async (): Promise<{
  labels: string[];
  datasets: any[];
}> => {
  const accessToken = await auth0.getAccessToken();
  if (!accessToken) throw new Error('No access token found');
  const activeListingsPerNeighbourhood =
    await fetchActiveListingsPerNeighbourhood(accessToken.token);
  return {
    labels: activeListingsPerNeighbourhood.map(
      (item: { neighbourhood: string }) => item.neighbourhood,
    ),
    datasets: [
      {
        label: 'Active Listings',
        data: activeListingsPerNeighbourhood.map(
          (item: { activeCount: number }) =>
            parseInt(item.activeCount.toString()),
        ),
        backgroundColor: '#ff0000',
        borderColor: '#000000',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };
};

/**
 * Generates chart data for reviews per month.
 * Fetches monthly reviews data and formats it for charting libraries.
 *
 * @returns {Promise<{ labels: string[], datasets: any[] }>} Chart data object with labels and datasets.
 */
export const createReviewsPerMonthData = async (): Promise<{
  labels: string[];
  datasets: any[];
}> => {
  const accessToken = await auth0.getAccessToken();
  if (!accessToken) throw new Error('No access token found');
  const reviewsPerMonth = await fetchReviewsPerMonth(accessToken.token);
  return {
    labels: reviewsPerMonth.map((item: { month: string }) => item.month),
    datasets: [
      {
        label: 'Reviews per Month',
        data: reviewsPerMonth.map((item: { count: number }) =>
          parseInt(item.count.toString()),
        ),
        backgroundColor: '#ff0000',
        borderColor: '#000000',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };
};

/**
 * Generates chart data for average reviews per month per neighbourhood.
 * Fetches average reviews data and formats it for charting libraries.
 *
 * @returns {Promise<{ labels: string[], datasets: any[] }>} Chart data object with labels and datasets.
 */
export const createAverageReviewsPerMonthPerNeighbourhoodData =
  async (): Promise<{ labels: string[]; datasets: any[] }> => {
    const accessToken = await auth0.getAccessToken();
    if (!accessToken) throw new Error('No access token found');
    const averageReviewsPerMonthPerNeighbourhood =
      await fetchAverageReviewsPerMonthPerNeighbourhood(accessToken.token);

    return {
      labels: averageReviewsPerMonthPerNeighbourhood.map(
        (item: { neighbourhood: string }) => item.neighbourhood,
      ),
      datasets: [
        {
          label: 'Average Reviews per Month',
          data: averageReviewsPerMonthPerNeighbourhood.map(
            (item: { avgReviewsPerMonth: number }) =>
              parseFloat(item.avgReviewsPerMonth.toFixed(2)),
          ),
          backgroundColor: '#ff0000',
          borderColor: '#000000',
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    };
  };

/**
 * Generates chart data for room types.
 * Fetches room types data and formats it for charting libraries.
 *
 * @returns {Promise<{ labels: string[], datasets: any[] }>} Chart data object with labels and datasets.
 */
export const createRoomTypesData = async (): Promise<{
  labels: string[];
  datasets: any[];
}> => {
  const accessToken = await auth0.getAccessToken();
  if (!accessToken) throw new Error('No access token found');
  const roomTypes = await fetchRoomTypes(accessToken.token);
  return {
    labels: roomTypes.map((item: { roomType: string }) => item.roomType),
    datasets: [
      {
        label: 'Room Types',
        data: roomTypes.map((item: { count: number }) =>
          parseInt(item.count.toString()),
        ),
        backgroundColor: ['#00ff00', '#0000ff', '#ffff00', '#ff0000'],
        borderColor: '#000000',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };
};
