export type EventType = "Festival" | "ArtandMusic" | "Sport" | "Food" | "custom";
export interface EventEntity {
    ID: number;
    Title: string;
    Start: string;
    End: string;
    EventType: string;
    Image: string;
    Detail: string;
    LocationLink: string;
    PageLink: string;
    RegisterLink: string;
  }