'use client';

import MapGL, { NavigationControl, Source, Layer } from 'react-map-gl/mapbox';
import { useState, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Drawer,
  DrawerFooter,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
  DrawerContent,
} from '@/components/ui/8bit/drawer';
import { Button } from './ui/8bit/button';
import type { Geometry } from 'geojson';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/8bit/accordion';
import { ScrollArea } from '@/components/ui/8bit/scroll-area';

const MAPBOX_PROPS = {
  longitude: 12.574698976221345,
  latitude: 55.677140731284005,
  zoom: 10.38,
};

interface MapProps {
  accessToken: string;
  geoJson: Geometry | null;
  selectedNeighbourhood: string | null;
}

interface Review {
  id: number;
  listingId: number;
  date: Date;
  reviewerId: number;
  reviewerName: string;
  comments: string;
}

interface SelectedHome {
  id: number;
  name: string;
  hostId: number;
  hostName: string | null;
  neighbourhoodGroup: string | null;
  neighbourhood: string;
  latitude: number;
  longitude: number;
  roomType: string;
  price: number | null;
  minimumNights: number;
  numberOfReviews: number;
  lastReview: string | null;
  reviewsPerMonth: number | null;
  calculatedHostListingsCount: number;
  availability365: number;
  numberOfReviewsLtm: number;
  license: string | null;
  reviews?: Review[];
}

export const Map = ({
  accessToken,
  geoJson,
  selectedNeighbourhood,
}: MapProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSelectedHomeLoading, setIsSelectedHomeLoading] =
    useState<boolean>(false);
  const [selectedHome, setSelectedHome] = useState<SelectedHome | null>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [neighbourhoodGeoJson, setNeighbourhoodGeoJson] =
    useState<Geometry | null>(null);

  useEffect(() => {
    const fetchSelectedHome = async () => {
      if (selectedId === null) {
        setSelectedHome(null);
        return;
      }

      setIsSelectedHomeLoading(true);
      try {
        const response = await fetch(
          `https://localhost:7297/api/listing/${selectedId}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch home data');
        }
        const data: SelectedHome = await response.json();
        setSelectedHome(data);
      } catch (error) {
        console.error('Error fetching selected home:', error);
      } finally {
        setIsSelectedHomeLoading(false);
      }
    };

    fetchSelectedHome();
  }, [selectedId]);

  useEffect(() => {
    const fetchNeighbourhoodGeoJson = async () => {
      if (!selectedNeighbourhood) {
        setNeighbourhoodGeoJson(null);
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:7297/api/neighbourhood/${selectedNeighbourhood}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch neighbourhood data');
        }
        const data: Geometry = await response.json();
        setNeighbourhoodGeoJson(data);
      } catch (error) {
        console.error('Error fetching neighbourhood GeoJSON:', error);
      }
    };

    fetchNeighbourhoodGeoJson();
  }, [selectedNeighbourhood]);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
      <div className="relative h-[500px] w-full">
        <MapGL
          mapboxAccessToken={accessToken}
          initialViewState={{ ...MAPBOX_PROPS }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          attributionControl={false}
          style={{ width: '100%', height: '100%', borderRadius: '8px' }}
          interactiveLayerIds={['homes-layer']}
          onClick={(e) => {
            const feature = e.features?.[0];
            if (feature && feature.properties) {
              setSelectedId(feature.properties.id);
              setDrawerOpen(true);
            }
          }}
        >
          <NavigationControl position="top-right" />
          {neighbourhoodGeoJson && (
            <Source
              id="neighbourhood"
              type="geojson"
              data={neighbourhoodGeoJson}
            >
              <Layer
                id="neighbourhood-layer"
                type="fill"
                paint={{
                  'fill-color': '#888',
                  'fill-opacity': 0.5,
                }}
              />
            </Source>
          )}
          {geoJson && (
            <Source id="homes" type="geojson" data={geoJson}>
              <Layer
                id="homes-layer"
                type="circle"
                paint={{
                  'circle-radius': 6,
                  'circle-color': '#ff0000',
                  'circle-stroke-color': '#ffffff',
                  'circle-stroke-width': 1,
                  'circle-opacity': 0.9,
                }}
              />
            </Source>
          )}
        </MapGL>
      </div>

      <DrawerContent side="bottom">
        {!isSelectedHomeLoading ? (
          <DrawerHeader className="p-4">
            <DrawerTitle className="text-lg font-bold">
              Home {selectedHome?.name}
            </DrawerTitle>

            <p>Type: {selectedHome?.roomType}</p>
            <p>Price: ${selectedHome?.price || 'Unknown'}</p>
            <p>Neighbourhood: {selectedHome?.neighbourhood}</p>
            <p>Host: {selectedHome?.hostName || 'Unknown'}</p>
            <p>Number of Reviews: {selectedHome?.numberOfReviews}</p>
            <p>Last Review: {selectedHome?.lastReview || 'N/A'}</p>
            <p>Availability: {selectedHome?.availability365} days</p>
            <p>Minimum Nights: {selectedHome?.minimumNights}</p>
            <p>License: {selectedHome?.license || 'N/A'}</p>
            {selectedHome?.reviews && (
              <Accordion type="single" collapsible>
                <AccordionItem value="reviews">
                  <AccordionTrigger className="text-lg font-semibold">
                    Reviews ({selectedHome?.numberOfReviews})
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="flex h-[500px] w-full flex-col p-4">
                      {selectedHome?.reviews?.length ? (
                        selectedHome.reviews.map((review) => (
                          <div key={review.id} className="mb-2">
                            <p>
                              <strong>{review.reviewerName}</strong> on{' '}
                              {new Date(review.date).toLocaleDateString()}:
                            </p>
                            <p className="pl-4">{review.comments}</p>
                          </div>
                        ))
                      ) : (
                        <p>No reviews available.</p>
                      )}
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </DrawerHeader>
        ) : (
          <DrawerHeader className="p-4">
            <DrawerTitle>Loading home...</DrawerTitle>
          </DrawerHeader>
        )}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-max hover:cursor-pointer">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
