'use server';

export const fetchAveragePricePerNeighbourhood = async (token: string) => {
  console.log(token);
  const response = await fetch(
    `${process.env.API_BASE_URL}/chart/average-price-per-neighbourhood`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(
      'Failed to fetch average price per neighbourhood: ' + response.statusText,
    );
  }
  return response.json();
};

export const fetchActiveListingsPerNeighbourhood = async (token: string) => {
  const response = await fetch(
    `${process.env.API_BASE_URL}/chart/active-listings-per-neighbourhood`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch active listings per neighbourhood');
  }
  return response.json();
};

export const fetchReviewsPerMonth = async (token: string) => {
  const response = await fetch(
    `${process.env.API_BASE_URL}/chart/reviews-per-month`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error('Failed to fetch reviews per month');
  }
  return response.json();
};

export const fetchAverageReviewsPerMonthPerNeighbourhood = async (
  token: string,
) => {
  const response = await fetch(
    `${process.env.API_BASE_URL}/chart/average-reviews-per-month-per-neighbourhood`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error(
      'Failed to fetch average reviews per month per neighbourhood',
    );
  }
  return response.json();
};

export const fetchRoomTypes = async (token: string) => {
  const response = await fetch(`${process.env.API_BASE_URL}/chart/room-types`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch room types');
  }
  return response.json();
};
