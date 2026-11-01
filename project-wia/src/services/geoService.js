/**
 * Geo-Discrepancy Detection & Spatial Calculation Engine
 * SMAUMU - Web In Action (WIA) MIA 2026
 */

/**
 * Calculate Great-Circle Distance (Haversine Formula) in meters
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100;
}

/**
 * Detect Geo-Discrepancy between applicant claimed coordinates and official geocoded records
 */
export function detectGeoDiscrepancy(claimedLat, claimedLng, verifiedLat, verifiedLng, schoolLat, schoolLng) {
  const claimedDistanceToSchool = calculateHaversineDistance(claimedLat, claimedLng, schoolLat, schoolLng);
  const verifiedDistanceToSchool = calculateHaversineDistance(verifiedLat, verifiedLng, schoolLat, schoolLng);
  const coordinateDivergence = calculateHaversineDistance(claimedLat, claimedLng, verifiedLat, verifiedLng);
  
  // Delta distance to school: how much closer did the applicant claim to be?
  const discrepancyDeltaMeters = Math.round((verifiedDistanceToSchool - claimedDistanceToSchool) * 100) / 100;
  
  let anomalyStatus = 'aman';
  let severityScore = 0; // 0 to 100
  let message = 'Koordinat klaim presisi dan sinkron dengan basis data geospasial resmi.';
  
  if (coordinateDivergence > 500 || discrepancyDeltaMeters > 400) {
    anomalyStatus = 'anomali_kritis_fraud';
    severityScore = Math.min(100, Math.round((coordinateDivergence / 1000) * 80 + 20));
    message = `Penyimpangan Kritis! Titik klaim digeser ${Math.round(coordinateDivergence)}m menjauhi alamat resmi Dukcapil untuk memperpendek jarak sekolah sebesar ${Math.round(discrepancyDeltaMeters)}m.`;
  } else if (coordinateDivergence > 150 || discrepancyDeltaMeters > 150) {
    anomalyStatus = 'peringatan_toleransi';
    severityScore = Math.min(50, Math.round((coordinateDivergence / 500) * 40 + 10));
    message = `Penyimpangan Toleransi GPS (${Math.round(coordinateDivergence)}m). Membutuhkan konfirmasi verifikator instansi.`;
  }
  
  return {
    claimedDistanceToSchool,
    verifiedDistanceToSchool,
    coordinateDivergence,
    discrepancyDeltaMeters,
    anomalyStatus,
    severityScore,
    message
  };
}
