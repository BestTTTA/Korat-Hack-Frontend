"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Image from "next/image";
import Link from "next/link";
import { BusinessEntity, EventEntity, CombinedEntity } from "@/type/EventType";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 14.69578,
  lng: 101.44794,
};

const Map: React.FC = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [businesses, setBusinesses] = useState<BusinessEntity[]>([]);
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [combinedEntities, setCombinedEntities] = useState<CombinedEntity[]>(
    []
  );
  const [selectedEntity, setSelectedEntity] = useState<CombinedEntity | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to geocode LocationLink into coordinates
  const geocodeLocation = async (locationLink: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          locationLink
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } else {
        console.error("Geocoding failed", data);
        return null;
      }
    } catch (err) {
      console.error("Error geocoding location:", err);
      return null;
    }
  };

  // Fetch businesses from the API
  const fetchBusinesses = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}business/`
      );
      const data = await response.json();

      // Add lat/lng if they don't exist
      const businessesWithCoords = await Promise.all(
        data.business_entities.map(async (business: BusinessEntity) => {
          if (!business.Latitude || !business.Longitude) {
            const coords = await geocodeLocation(business.Location);
            if (coords) {
              return { ...business, Latitude: coords.lat, Longitude: coords.lng };
            }
          }
          return business;
        })
      );

      setBusinesses(businessesWithCoords || []);
    } catch (err) {
      console.error("Failed to fetch businesses:", err);
      setError("Failed to fetch businesses.");
    }
  }, []);

  // Fetch events from the API
  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}event/`);
      const data = await response.json();

      const eventsWithCoords = await Promise.all(
        data.event_entities.map(async (event: EventEntity) => {
          if (!event.Latitude || !event.Longitude) {
            const coords = await geocodeLocation(
              event.LocationLink || event.Location
            );
            if (coords) {
              return { ...event, Latitude: coords.lat, Longitude: coords.lng };
            }
          }
          return event;
        })
      );

      setEvents(eventsWithCoords || []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to fetch events.");
    }
  }, []);

  // Fetch both businesses and events
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchBusinesses(), fetchEvents()]);
    setLoading(false);
  }, [fetchBusinesses, fetchEvents]);

  // Fetch the data on component mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Combine businesses and events
  useEffect(() => {
    const combined: CombinedEntity[] = [
      ...businesses.map((business) => ({
        ...business,
        entityType: "business" as const,
      })),
      ...events.map((event) => ({ ...event, entityType: "event" as const })),
    ];
    setCombinedEntities(combined);
  }, [businesses, events]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="w-full p-10">
      <div className="text-3xl font-extrabold pt-8 pb-5 lg:text-left">
        <span>สถานที่ต่างๆ บนแผนที่</span>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {!loading && !error && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={center}
        >
          {combinedEntities.map((entity) => {
            const lat =
              typeof entity.Latitude === "string"
                ? parseFloat(entity.Latitude)
                : entity.Latitude;
            const lng =
              typeof entity.Longitude === "string"
                ? parseFloat(entity.Longitude)
                : entity.Longitude;

            if (
              typeof lat !== "number" ||
              isNaN(lat) ||
              typeof lng !== "number" ||
              isNaN(lng)
            ) {
              console.warn(
                `Invalid Latitude or Longitude for entity ID ${entity.ID}`
              );
              return null;
            }

            return (
              <Marker
                key={`${entity.entityType}-${entity.ID}`}
                position={{ lat, lng }}
                onClick={() => setSelectedEntity(entity)}
                icon={{
                  url:
                    entity.entityType === "business"
                      ? "/business-marker.png"
                      : "/event-marker.png", // Different marker icons for business and event
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            );
          })}

          {selectedEntity &&
            (() => {
              const selectedLat =
                typeof selectedEntity.Latitude === "string"
                  ? parseFloat(selectedEntity.Latitude)
                  : selectedEntity.Latitude;
              const selectedLng =
                typeof selectedEntity.Longitude === "string"
                  ? parseFloat(selectedEntity.Longitude)
                  : selectedEntity.Longitude;

              // Check if latitude and longitude are valid numbers for the selected entity
              if (
                typeof selectedLat !== "number" ||
                isNaN(selectedLat) ||
                typeof selectedLng !== "number" ||
                isNaN(selectedLng)
              ) {
                console.warn(
                  `Invalid Latitude or Longitude for selected entity ID ${selectedEntity.ID}`
                );
                return null;
              }

              return (
                <InfoWindow
                  position={{ lat: selectedLat, lng: selectedLng }}
                  onCloseClick={() => setSelectedEntity(null)}
                >
                  <div className="p-2">
                    <h3 className="font-bold">{selectedEntity.Title}</h3>
                    <Image
                      src={selectedEntity.Image}
                      alt={selectedEntity.Title}
                      width={100}
                      height={100}
                      className="rounded mt-2"
                    />
                    <p className="mt-2">{selectedEntity.Detail}</p>

                    {selectedEntity.entityType === "business" ? (
                      <>
                        <Link
                          href={selectedEntity.Location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline mt-2 block"
                        >
                          ดูตำแหน่งบน Google Maps
                        </Link>
                        {selectedEntity.PageLink && (
                          <Link
                            href={selectedEntity.PageLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline mt-2 block"
                          >
                            ดูเพิ่มเติม
                          </Link>
                        )}
                      </>
                    ) : (
                      <>
                        <Link
                          href={
                            selectedEntity.LocationLink ||
                            selectedEntity.Location
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline mt-2 block"
                        >
                          ดูตำแหน่งบน Google Maps
                        </Link>
                        {selectedEntity.RegisterLink && (
                          <Link
                            href={selectedEntity.RegisterLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline mt-2 block"
                          >
                            ลงทะเบียน
                          </Link>
                        )}
                        {selectedEntity.PageLink && (
                          <Link
                            href={selectedEntity.PageLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline mt-2 block"
                          >
                            ดูเพิ่มเติม
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </InfoWindow>
              );
            })()}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
