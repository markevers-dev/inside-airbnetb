'use client';

import { useState } from 'react';
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

const MOCK_NEIGHBOURHOODS = [
  'Amager st',
  'Amager Vest',
  'Bispebjerg',
  'Brnshj-Husum',
  'Frederiksberg',
];

const PRICE_RANGES = [
  '',
  '0-100',
  '100-200',
  '200-500',
  '500-750',
  '750+',
] as const;
type PriceRange = (typeof PRICE_RANGES)[number];

const NUM_OF_REVIEWS = [0, 10, 25, 50, 100, 1000] as const;
type NumReviews = (typeof NUM_OF_REVIEWS)[number];

const Home = () => {
  const [numberOfReviews, setNumberOfReviews] = useState<NumReviews>(0);
  const [priceRange, setPriceRange] = useState<PriceRange>('');
  const [selectedNeighbourhood, setSelectedNeighbourhood] =
    useState<string>('');

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

        <CardContent className="flex flex-col max-xl:space-y-8 xl:flex-row xl:space-x-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="w-max hover:cursor-pointer"
              >
                {selectedNeighbourhood !== ''
                  ? `Neighbourhood: ${selectedNeighbourhood}`
                  : 'Select Neighbourhood'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                {selectedNeighbourhood !== '' && (
                  <DropdownMenuItem
                    onClick={() => setSelectedNeighbourhood('')}
                  >
                    Reset
                  </DropdownMenuItem>
                )}
                {MOCK_NEIGHBOURHOODS.map((neighbourhood) => (
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
          <Map
            accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ''}
          />
          <div className="flex flex-col items-start justify-start space-x-4 md:flex-row md:space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-max hover:cursor-pointer"
                >
                  {priceRange !== ''
                    ? `Price Range: ${priceRange}`
                    : 'Select Price Range'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  {priceRange !== '' && (
                    <DropdownMenuItem onClick={() => setPriceRange('')}>
                      Reset
                    </DropdownMenuItem>
                  )}
                  {PRICE_RANGES.map((range) => (
                    <DropdownMenuItem
                      key={range}
                      onClick={() => setPriceRange(range)}
                    >
                      {range}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-max hover:cursor-pointer"
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
