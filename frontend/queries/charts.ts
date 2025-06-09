'use server';

export const fetchAveragePricePerNeighbourhood = async () => {
  console.log(process.env.API_BASE_URL);
  const response = await fetch(
    `${process.env.API_BASE_URL}/chart/average-price-per-neighbourhood`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch average price per neighbourhood');
  }
  return response.json();
};

export const fetchActiveListingsPerNeighbourhood = async () => {
  const response = await fetch(
    `${process.env.API_BASE_URL}/chart/active-listings-per-neighbourhood`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch active listings per neighbourhood');
  }
  return response.json();
};

export const fetchReviewsPerMonth = async () => {
  const response = await fetch(
    `${process.env.API_BASE_URL}/chart/reviews-per-month`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch reviews per month');
  }
  return response.json();
};

export const fetchAverageReviewsPerMonthPerNeighbourhood = async () => {
  const response = await fetch(
    `${process.env.API_BASE_URL}/chart/average-reviews-per-month-per-neighbourhood`,
  );
  if (!response.ok) {
    throw new Error(
      'Failed to fetch average reviews per month per neighbourhood',
    );
  }
  return response.json();
};

export const fetchRoomTypes = async () => {
  const response = await fetch(`${process.env.API_BASE_URL}/chart/room-types`);
  if (!response.ok) {
    throw new Error('Failed to fetch room types');
  }
  return response.json();
};
