'use client';

import { useState, useEffect } from 'react';
import { Map } from '@/components/map';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from '@/components/ui/8bit/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/8bit/dropdown-menu';
import { Button } from '@/components/ui/8bit/button';
import type { Geometry } from 'geojson';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/8bit/pagination';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/8bit/alert';

const PAGE_SIZE = '50';

const PRICE_RANGES = [
  null,
  '0-100',
  '100-200',
  '200-500',
  '500-750',
  '750+',
] as const;
type PriceRange = (typeof PRICE_RANGES)[number];

const NUM_OF_REVIEWS = [0, 10, 25, 50, 100, 250, 1000] as const;
type NumReviews = (typeof NUM_OF_REVIEWS)[number];

const Home = () => {
  const [numberOfReviews, setNumberOfReviews] = useState<NumReviews>(0);
  const [priceRange, setPriceRange] = useState<PriceRange>(null);
  const [selectedNeighbourhood, setSelectedNeighbourhood] = useState<
    string | null
  >(null);
  const [geoJson, setGeoJson] = useState<Geometry | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [neighbourhoods, setNeighbourhoods] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNeighbourhoods = async () => {
      try {
        setFetchError(null);
        const response = await fetch(
          'https://localhost:7297/api/neighbourhood',
        );
        if (!response.ok) {
          throw new Error(
            'Network response was not ok. Maybe it should seek therapy?',
          );
        }
        const data = await response.json();
        const neighbourhoodNames = data.map(
          (neighbourhood: { neighbourhood1: string }) =>
            neighbourhood.neighbourhood1,
        );
        setNeighbourhoods(neighbourhoodNames);
      } catch (error) {
        if (fetchError != null) return;
        setFetchError('An error occurred while fetching map data.');
      }
    };
    fetchNeighbourhoods();
  }, []);

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        setFetchError(null);
        const queryParams = new URLSearchParams({
          pageNumber: pageNumber.toString(),
          pageSize: PAGE_SIZE,
          minReviews: numberOfReviews.toString(),
          ...(priceRange && { priceRange }),
          ...(selectedNeighbourhood && {
            neighbourhood: selectedNeighbourhood,
          }),
        });
        const response = await fetch(
          `https://localhost:7297/api/listing?${queryParams.toString()}`,
        );
        if (!response.ok) {
          throw new Error(
            'Network response was not ok. Maybe it should seek therapy?',
          );
        }
        const data = await response.json();
        setGeoJson(data);
      } catch (error) {
        if (fetchError != null) return;
        setFetchError('An error occurred while fetching map data.');
      }
    };
    fetchGeoJson();
  }, [pageNumber, numberOfReviews, priceRange, selectedNeighbourhood]);

  return (
    <main className="relative w-full px-8 font-[family-name:var(--font-geist-sans)] md:px-20">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Homes in Copenhagen</CardTitle>
          <CardDescription>
            Use the filters below to explore different neighbourhoods and their
            characteristics.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col space-y-8">
          {fetchError && (
            <Alert>
              <AlertTitle className="font-bold text-red-500">
                {fetchError}
              </AlertTitle>
              <AlertDescription>Please try again later.</AlertDescription>
            </Alert>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="!h-fit w-fit !text-balance hover:cursor-pointer"
              >
                {selectedNeighbourhood !== null
                  ? `Neighbourhood: ${selectedNeighbourhood}`
                  : 'Select Neighbourhood'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                {selectedNeighbourhood !== null && (
                  <DropdownMenuItem
                    onClick={() => setSelectedNeighbourhood(null)}
                  >
                    Reset
                  </DropdownMenuItem>
                )}
                {neighbourhoods?.map((neighbourhood) => (
                  <DropdownMenuItem
                    key={neighbourhood}
                    onClick={() => setSelectedNeighbourhood(neighbourhood)}
                  >
                    {neighbourhood}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination> */}
          <Map
            accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ''}
            geoJson={geoJson}
            selectedNeighbourhood={selectedNeighbourhood}
          />
          <div className="flex flex-col items-start justify-start max-lg:space-y-4 lg:flex-row lg:space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="!h-fit w-fit !text-balance hover:cursor-pointer"
                >
                  {priceRange !== null
                    ? `Price Range: ${priceRange}`
                    : 'Select Price Range'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  {priceRange !== null && (
                    <DropdownMenuItem onClick={() => setPriceRange(null)}>
                      Reset
                    </DropdownMenuItem>
                  )}
                  {PRICE_RANGES.filter((range) => range !== null).map(
                    (range) => (
                      <DropdownMenuItem
                        key={range}
                        onClick={() => setPriceRange(range)}
                      >
                        {range}
                      </DropdownMenuItem>
                    ),
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="!h-fit w-fit !text-balance hover:cursor-pointer"
                >
                  {numberOfReviews != 0
                    ? `Number of Reviews: ${numberOfReviews}+`
                    : 'Select Number of Reviews'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  {numberOfReviews !== 0 && (
                    <DropdownMenuItem onClick={() => setNumberOfReviews(0)}>
                      Reset
                    </DropdownMenuItem>
                  )}
                  {NUM_OF_REVIEWS.map((num) => (
                    <DropdownMenuItem
                      key={num}
                      onClick={() => setNumberOfReviews(num)}
                    >
                      {num}+
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Home;
