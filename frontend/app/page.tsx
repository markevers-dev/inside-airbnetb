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

const PAGE_SIZE = '200';

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
  const [maxPageCount, setMaxPageCount] = useState<number>(1);

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
        if (process.env.NODE_ENV === 'development') console.error(error);
        setFetchError('An error occurred while fetching data.');
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
        setGeoJson(data.features);
        setMaxPageCount(data.totalPages);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error(error);
        setFetchError('An error occurred while fetching data.');
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
                    onClick={() => {
                      setSelectedNeighbourhood(null);
                      setPageNumber(1);
                    }}
                  >
                    Reset
                  </DropdownMenuItem>
                )}
                {neighbourhoods?.map((neighbourhood) => (
                  <DropdownMenuItem
                    key={neighbourhood}
                    onClick={() => {
                      setSelectedNeighbourhood(neighbourhood);
                      setPageNumber(1);
                    }}
                  >
                    {neighbourhood}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Pagination>
            <PaginationContent className="!flex !w-full !flex-row !items-center !justify-center !gap-x-4 sm:!gap-x-20">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageNumber > 1) setPageNumber((prev) => prev - 1);
                  }}
                  className={
                    pageNumber === 1 ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>
              {pageNumber > 1 && (
                <PaginationItem
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageNumber > 1) setPageNumber((prev) => prev - 1);
                  }}
                >
                  <PaginationLink href="#">{pageNumber - 1}</PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
              {pageNumber < maxPageCount && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPageNumber((prev) => prev + 1);
                    }}
                  >
                    {pageNumber + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPageNumber((prev) => prev + 1);
                  }}
                  {...(pageNumber >= maxPageCount && { disabled: true })}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
                    <DropdownMenuItem
                      onClick={() => {
                        setPriceRange(null);
                        setPageNumber(1);
                      }}
                    >
                      Reset
                    </DropdownMenuItem>
                  )}
                  {PRICE_RANGES.filter((range) => range !== null).map(
                    (range) => (
                      <DropdownMenuItem
                        key={range}
                        onClick={() => {
                          setPriceRange(range);
                          setPageNumber(1);
                        }}
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
                    <DropdownMenuItem
                      onClick={() => {
                        setNumberOfReviews(0);
                        setPageNumber(1);
                      }}
                    >
                      Reset
                    </DropdownMenuItem>
                  )}
                  {NUM_OF_REVIEWS.map((num) => (
                    <DropdownMenuItem
                      key={num}
                      onClick={() => {
                        setNumberOfReviews(num);
                        setPageNumber(1);
                      }}
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
