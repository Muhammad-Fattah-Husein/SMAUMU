/**
 * Passing-Grade Simulator & Acceptance Probability Calculator
 * SMAUMU - Web In Action (WIA) MIA 2026
 * Supports Data-Driven Decision Support
 */

export function simulateSchoolAcceptance({
  school,
  jalur,
  distanceMeters,
  raporScore,
  prestasiScore = 0,
  currentRegistrants = []
}) {
  const totalQuota = school.kuota_total || 288;
  let jalurQuotaRatio = 0.5; // Zonasi 50%
  if (jalur === 'afirmasi') jalurQuotaRatio = 0.2;
  if (jalur === 'prestasi_akademik') jalurQuotaRatio = 0.2;
  if (jalur === 'prestasi_non_akademik') jalurQuotaRatio = 0.05;
  if (jalur === 'perpindahan_tugas') jalurQuotaRatio = 0.05;

  const quotaSeatCount = Math.round(totalQuota * jalurQuotaRatio);
  
  // Scoring algorithm based on Jalur
  let applicantScore = 0;
  let distanceWeight = 0;
  let academicWeight = 0;

  if (jalur === 'zonasi') {
    // Inverse distance score: closer distance yields higher score
    // Max radius 3500m
    const maxRadius = school.radius_max || 3500;
    const normDistance = Math.min(distanceMeters, maxRadius);
    const distanceFactor = Math.max(0, (maxRadius - normDistance) / maxRadius);
    applicantScore = distanceFactor * 85 + (raporScore / 100) * 15;
    distanceWeight = 85;
    academicWeight = 15;
  } else if (jalur === 'prestasi_akademik') {
    applicantScore = raporScore * 0.8 + (prestasiScore || 0) * 0.2;
    distanceWeight = 0;
    academicWeight = 80;
  } else if (jalur === 'afirmasi') {
    const maxRadius = school.radius_max || 3500;
    const distanceFactor = Math.max(0, (maxRadius - distanceMeters) / maxRadius);
    applicantScore = distanceFactor * 60 + (raporScore / 100) * 40;
    distanceWeight = 60;
    academicWeight = 40;
  } else {
    // Default
    applicantScore = (raporScore * 0.7) + (prestasiScore * 0.3);
  }

  // Estimated Rank & Probability Computation
  // Simulate simulated applicants distribution curve
  const simulatedTotalApplicants = Math.max(quotaSeatCount * 1.8, 120);
  
  // Calculate relative standing based on historical/current distributions
  let estimatedRank = 1;
  if (jalur === 'zonasi') {
    // Average cutoff distance is usually around 800 - 1400m
    const cutoffDistance = 1100;
    if (distanceMeters <= 300) {
      estimatedRank = Math.max(1, Math.round(quotaSeatCount * 0.15));
    } else if (distanceMeters <= 700) {
      estimatedRank = Math.max(1, Math.round(quotaSeatCount * 0.45));
    } else if (distanceMeters <= cutoffDistance) {
      estimatedRank = Math.max(1, Math.round(quotaSeatCount * 0.85));
    } else if (distanceMeters <= cutoffDistance * 1.3) {
      estimatedRank = Math.round(quotaSeatCount * 1.15);
    } else {
      estimatedRank = Math.round(quotaSeatCount * 1.6);
    }
  } else {
    // Academic cutoff typically around 86.5
    const academicCutoff = 87.0;
    const diff = raporScore - academicCutoff;
    if (diff >= 3.0) {
      estimatedRank = Math.max(1, Math.round(quotaSeatCount * 0.2));
    } else if (diff >= 0.5) {
      estimatedRank = Math.max(1, Math.round(quotaSeatCount * 0.65));
    } else if (diff >= -1.0) {
      estimatedRank = Math.max(1, Math.round(quotaSeatCount * 0.95));
    } else {
      estimatedRank = Math.round(quotaSeatCount * 1.4);
    }
  }

  // Probability %
  let probability = 0;
  if (estimatedRank <= quotaSeatCount * 0.5) {
    probability = Math.round(92 + (1 - estimatedRank / (quotaSeatCount * 0.5)) * 7);
  } else if (estimatedRank <= quotaSeatCount * 0.85) {
    probability = Math.round(75 + (1 - (estimatedRank - quotaSeatCount * 0.5) / (quotaSeatCount * 0.35)) * 16);
  } else if (estimatedRank <= quotaSeatCount) {
    probability = Math.round(52 + (1 - (estimatedRank - quotaSeatCount * 0.85) / (quotaSeatCount * 0.15)) * 22);
  } else if (estimatedRank <= quotaSeatCount * 1.25) {
    probability = Math.round(25 + (1 - (estimatedRank - quotaSeatCount) / (quotaSeatCount * 0.25)) * 26);
  } else {
    probability = Math.max(5, Math.round(15 - ((estimatedRank - quotaSeatCount * 1.25) / 50) * 10));
  }
  probability = Math.min(99, Math.max(1, probability));

  let category = 'Sangat Aman';
  let badgeColor = 'emerald';
  let tip = 'Posisi Anda sangat kuat berada di 50% teratas kuota kursi tersedia.';

  if (probability < 40) {
    category = 'Rentan Tergeser (Tinggi Risiko)';
    badgeColor = 'rose';
    tip = 'Peringkat estimasi telah melampaui batas kuota daya tampung. Disarankan memilih SMAN alternatif dengan rasio pendaftar lebih rendah.';
  } else if (probability < 75) {
    category = 'Kompetitif (Zona Waspada)';
    badgeColor = 'amber';
    tip = 'Peringkat Anda berada di ambang batas kuota. Pantau live quota burn-rate secara berkala setiap jam.';
  }

  return {
    schoolId: school.id,
    schoolName: school.nama_sekolah,
    jalur,
    quotaSeatCount,
    estimatedRank,
    probability,
    category,
    badgeColor,
    applicantScore: Math.round(applicantScore * 10) / 10,
    tip,
    distanceMeters,
    raporScore
  };
}
