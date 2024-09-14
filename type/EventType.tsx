export type EventType = "Festival" | "ArtandMusic" | "Sport" | "Food" | "custom";

export interface BusinessEntity {
  ID: number;
  Title: string;
  Detail: string;
  Type: string;
  Location: string; // URL link to Google Maps
  Latitude?: number | string; // อนุญาตให้เป็น number หรือ string หรือไม่ก็ได้
  Longitude?: number | string; // อนุญาตให้เป็น number หรือ string หรือไม่ก็ได้
  Image: string;
  PageLink?: string;
}

// ประเภทข้อมูลสำหรับ EventEntity
export interface EventEntity {
  ID: number;
  Title: string;
  Start: string;
  End: string;
  EventType: string;
  Image: string;
  Detail: string;
  Location: string; // URL link to Google Maps
  LocationLink?: string;
  Latitude?: number | string; // อนุญาตให้เป็น number หรือ string หรือไม่ก็ได้
  Longitude?: number | string; // อนุญาตให้เป็น number หรือ string หรือไม่ก็ได้
  PageLink?: string;
  RegisterLink?: string;
}

// CombinedEntity เป็น discriminated union
export type CombinedEntity =
  | (BusinessEntity & { entityType: "business" })
  | (EventEntity & { entityType: "event" });