export const DEFAULT_MOCK_PROFILE = {
  firstName: "User",
  location: "Hawaii",
};

export const getTimeOfDayGreeting = (
  firstName: string,
  hour: number,
  hasLocation: boolean,
) => {
  if (hour >= 5 && hour <= 11) {
    return `Good morning, ${firstName}`;
  }
  if (hour >= 17 && hour <= 20) {
    return `Good evening, ${firstName}`;
  }
  if ((hour >= 21 || hour <= 4) && !hasLocation) {
    return "Hello night Owl";
  }
  return `Hello, ${firstName}`;
};

export const getLocationSlangGreeting = (
  firstName: string,
  locationLabel?: string | null,
) => {
  if (!locationLabel) {
    return null;
  }
  const normalized = locationLabel.trim().toLowerCase();
  if (normalized === "hawaii") {
    return `Aloha, ${firstName}`;
  }
  if (normalized === "spain") {
    return `Ola, ${firstName}`;
  }
  return null;
};

export const matchLocationFromCoords = (lat: number, lon: number) => {
  const isHawaii = lat >= 18 && lat <= 23 && lon >= -161 && lon <= -154;
  if (isHawaii) {
    return "Hawaii";
  }
  const isSpain = lat >= 36 && lat <= 44 && lon >= -9.5 && lon <= 3.5;
  if (isSpain) {
    return "Spain";
  }
  return null;
};
