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
  const [combinedEntities, setCombinedEntities] = useState<CombinedEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<CombinedEntity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const resolveShortLink = async (shortUrl: string) => {
    try {
      const response = await fetch(`/api/extractLatLon?url=${encodeURIComponent(shortUrl)}`);
      const data = await response.json();
  
      if (data.lat && data.lon) {
        return { lat: data.lat, lon: data.lon };
      } else {
        console.error("Failed to resolve short link:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error resolving short link:", error);
      return null;
    }
  };

  const fetchBusinesses = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}business/`);
      const data = await response.json();
  
      const businessesWithCoords = await Promise.all(
        data.business_entities.map(async (business: any) => {
          if (business.LocationLink || business.Location) {
            const coords = await resolveShortLink(business.LocationLink || business.Location);
            if (coords) {
              return { ...business, Latitude: coords.lat, Longitude: coords.lon };
            }
          }
          return business; // ถ้าไม่พบพิกัดให้ใช้ข้อมูลเดิม
        })
      );
      
      setBusinesses(businessesWithCoords || []);
    } catch (err) {
      console.error("Failed to fetch businesses:", err);
      setError("Failed to fetch businesses.");
    }
  }, []);
  
  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}event/`);
      const data = await response.json();
  
      const eventsWithCoords = await Promise.all(
        data.event_entities.map(async (event: any) => {
          if (event.LocationLink) {
            const coords = await resolveShortLink(event.LocationLink);
            if (coords) {
              return { ...event, Latitude: coords.lat, Longitude: coords.lon };
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

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchBusinesses(), fetchEvents()]);
    setLoading(false);
  }, [fetchBusinesses, fetchEvents]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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
            const lat = parseFloat(entity.Latitude as any);
            const lng = parseFloat(entity.Longitude as any);

            if (isNaN(lat) || isNaN(lng)) {
              console.warn(`Invalid Latitude or Longitude for entity ID ${entity.ID}`);
              return null;
            }

            return (
              <Marker
                key={`${entity.entityType}-${entity.ID}`}
                position={{ lat, lng }}
                onClick={() => setSelectedEntity(entity)}
                icon={{
                  url: entity.Image, // ใช้รูปจาก API
                  scaledSize: new window.google.maps.Size(40, 40), // กำหนดขนาด
                }}
              />
            );
          })}

          {selectedEntity && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedEntity.Latitude as any),
                lng: parseFloat(selectedEntity.Longitude as any),
              }}
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
                      href={selectedEntity.LocationLink || selectedEntity.Location}
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
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;
