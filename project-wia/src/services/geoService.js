/**
 * Geo-Discrepancy Detection & Spatial Calculation Engine
 * Includes Strict Coordinate Boundary Validation & Auto-Snap Dukcapil Engine
 * SMAUMU - Web In Action (WIA) MIA 2026 - Tim FounDred
 */

// Batas Administratif Resmi Provinsi DKI Jakarta (Bounding Box)
export const DKI_JAKARTA_BOUNDS = {
  minLat: -6.375,
  maxLat: -6.085,
  minLng: 106.685,
  maxLng: 106.985
};

// Titik Centroid Resmi Dukcapil Per Kecamatan / Kelurahan DKI Jakarta
export const OFFICIAL_DUKCAPIL_CENTROIDS = [
  {
    id: 'sawah_besar',
    nama: 'Kec. Sawah Besar (Pasar Baru / Karang Anyar)',
    kota: 'Jakarta Pusat',
    lat: -6.162500,
    lng: 106.833500,
    alamatSample: 'Jl. Pasar Baru Timur No. 18, Sawah Besar'
  },
  {
    id: 'senen',
    nama: 'Kec. Senen (Kwitang / Kenari / Salemba)',
    kota: 'Jakarta Pusat',
    lat: -6.192000,
    lng: 106.848000,
    alamatSample: 'Jl. Kramat Raya No. 45, Senen'
  },
  {
    id: 'gambir',
    nama: 'Kec. Gambir (Petojo / Cideng / Kebon Kelapa)',
    kota: 'Jakarta Pusat',
    lat: -6.175110,
    lng: 106.827153,
    alamatSample: 'Jl. Gambir Selatan No. 5, Gambir'
  },
  {
    id: 'cempaka_putih',
    nama: 'Kec. Cempaka Putih (Rawasari)',
    kota: 'Jakarta Pusat',
    lat: -6.182000,
    lng: 106.868000,
    alamatSample: 'Jl. Cempaka Putih Tengah No. 20, Cempaka Putih'
  },
  {
    id: 'menteng',
    nama: 'Kec. Menteng (Gondangdia / Cikini)',
    kota: 'Jakarta Pusat',
    lat: -6.196000,
    lng: 106.838000,
    alamatSample: 'Jl. Teuku Umar No. 12, Menteng'
  },
  {
    id: 'tebet',
    nama: 'Kec. Tebet (Bukit Duri / Tebet Barat / Manggarai)',
    kota: 'Jakarta Selatan',
    lat: -6.228000,
    lng: 106.856000,
    alamatSample: 'Jl. Tebet Barat Raya No. 42, Tebet'
  },
  {
    id: 'cilandak',
    nama: 'Kec. Cilandak (Pondok Labu / Gandaria)',
    kota: 'Jakarta Selatan',
    lat: -6.305000,
    lng: 106.802000,
    alamatSample: 'Jl. Margasatwa Barat No. 8, Cilandak'
  },
  {
    id: 'pasar_minggu',
    nama: 'Kec. Pasar Minggu (Ragunan / Pejaten)',
    kota: 'Jakarta Selatan',
    lat: -6.287000,
    lng: 106.836000,
    alamatSample: 'Jl. Pejaten Barat No. 15, Pasar Minggu'
  },
  {
    id: 'kebayoran_baru',
    nama: 'Kec. Kebayoran Baru (Kramat Pela / Melawai)',
    kota: 'Jakarta Selatan',
    lat: -6.242000,
    lng: 106.798000,
    alamatSample: 'Jl. Kyai Maja No. 3, Kebayoran Baru'
  },
  {
    id: 'pulo_gadung',
    nama: 'Kec. Pulo Gadung (Rawamangun / Cipinang)',
    kota: 'Jakarta Timur',
    lat: -6.195000,
    lng: 106.892000,
    alamatSample: 'Jl. Pemuda No. 66, Rawamangun'
  }
];

/**
 * Validasi apakah koordinat berada di dalam wilayah hukum administratif DKI Jakarta
 */
export function isInsideDkiJakarta(lat, lng) {
  if (!lat || !lng) return false;
  const numLat = parseFloat(lat);
  const numLng = parseFloat(lng);
  return (
    numLat >= DKI_JAKARTA_BOUNDS.minLat &&
    numLat <= DKI_JAKARTA_BOUNDS.maxLat &&
    numLng >= DKI_JAKARTA_BOUNDS.minLng &&
    numLng <= DKI_JAKARTA_BOUNDS.maxLng
  );
}

/**
 * Mencari centroid Dukcapil terdekat dari suatu titik
 */
export function findClosestDukcapilCentroid(lat, lng) {
  if (!lat || !lng) return OFFICIAL_DUKCAPIL_CENTROIDS[0];
  let closest = OFFICIAL_DUKCAPIL_CENTROIDS[0];
  let minDistance = Infinity;

  for (const c of OFFICIAL_DUKCAPIL_CENTROIDS) {
    const d = calculateHaversineDistance(lat, lng, c.lat, c.lng);
    if (d < minDistance) {
      minDistance = d;
      closest = c;
    }
  }

  return { ...closest, distanceMeters: minDistance };
}

/**
 * Mekanisme Auto-Snap ke Koordinat Dukcapil Resmi
 * Mengunci titik koordinat pendaftar ke centroid pemetaan Dukcapil
 */
export function snapCoordinateToDukcapil(centroidIdOrText) {
  if (!centroidIdOrText) return OFFICIAL_DUKCAPIL_CENTROIDS[0];
  
  const textLower = centroidIdOrText.toLowerCase();
  const matched = OFFICIAL_DUKCAPIL_CENTROIDS.find(c => 
    c.id.toLowerCase() === textLower || 
    c.nama.toLowerCase().includes(textLower) ||
    textLower.includes(c.id.replace('_', ' ')) ||
    c.kota.toLowerCase().includes(textLower)
  );

  return matched || OFFICIAL_DUKCAPIL_CENTROIDS[0];
}

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
