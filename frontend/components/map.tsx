'use client';

import MapGL, { NavigationControl, Source, Layer } from 'react-map-gl/mapbox';
import { useState } from 'react';
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

const MAPBOX_PROPS = {
  longitude: 12.574698976221345,
  latitude: 55.677140731284005,
  zoom: 10.38,
};

interface MapProps {
  accessToken: string;
}

export const Map = ({ accessToken }: MapProps) => {
  const [selectedHome, setSelectedHome] = useState<any>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

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
            if (feature) {
              setSelectedHome(feature.properties);
              setDrawerOpen(true);
            }
          }}
        >
          <NavigationControl position="top-right" />

          <Source id="mock-homes" type="geojson" data="/points.geojson">
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
        </MapGL>
      </div>

      <DrawerContent side="bottom">
        {selectedHome ? (
          <DrawerHeader className="p-4">
            <DrawerTitle className="text-lg font-bold">
              {selectedHome.name}
            </DrawerTitle>
            <p>Type: {selectedHome.roomType}</p>
            <p>Price: ${selectedHome.price}</p>
            <p>Neighbourhood: {selectedHome.neighbourhood}</p>
          </DrawerHeader>
        ) : (
          <DrawerHeader className="p-4">
            <DrawerTitle>No home selected</DrawerTitle>
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
