export interface LocationFeature {
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    [key: string]: any;
  };
  geometry: {
    coordinates: [number, number];
    [key: string]: any;
  };
}

export interface TripData {
  currentLocation: LocationFeature | null;
  pickupLocation: LocationFeature | null;
  dropoffLocation: LocationFeature | null;
  currentCycleUsed: number;
}

export type PhotonFeature = {
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    [key: string]: any;
  };
  geometry: {
    coordinates: [number, number];
    [key: string]: any;
  };
  [key: string]: any;
};
