
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const earthRadiusKm = 6371;

  const latDiff = degToRad(lat2 - lat1);
  const lonDiff = degToRad(lon2 - lon1);

  const lat1Rad = degToRad(lat1);
  const lat2Rad = degToRad(lat2);

  const sinLat = Math.sin(latDiff / 2);
  const sinLon = Math.sin(lonDiff / 2);

  const a =
    sinLat * sinLat + Math.cos(lat1Rad) * Math.cos(lat2Rad) * sinLon * sinLon;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

const degToRad = (deg: number) => {
  return (deg * Math.PI) / 180;
};
