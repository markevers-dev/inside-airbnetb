"use server";

import { mockListings } from "@/data/mock-listings";
import Map from "@/components/map";

const Home = async () => {
  const styleLink = `https://api.maptiler.com/maps/dataviz/style.json?key=${process.env.MAP_TILER_API_KEY}`;
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Airbnb Listings in Copenhagen
        </h1>
        <Map listings={mockListings} styleLink={styleLink} />
      </main>
    </div>
  );
};

export default Home;
