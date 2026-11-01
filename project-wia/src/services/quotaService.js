/**
 * Quota Burn-Rate Engine & Saturation Analytics
 * SMAUMU - Web In Action (WIA) MIA 2026
 */

export function calculateBurnRateMetrics(totalQuota, filledQuota, totalApplicants, burnRatePerHour) {
  const remainingQuota = Math.max(0, totalQuota - filledQuota);
  const saturationPercentage = totalQuota > 0 ? (filledQuota / totalQuota) * 100 : 0;
  const applicantRatio = totalQuota > 0 ? (totalApplicants / totalQuota) : 0;
  
  let hoursUntilFull = null;
  if (burnRatePerHour > 0 && remainingQuota > 0) {
    hoursUntilFull = Math.round((remainingQuota / burnRatePerHour) * 10) / 10;
  }
  
  let status = 'buka';
  let statusColor = 'emerald';
  
  if (remainingQuota === 0 || saturationPercentage >= 100) {
    status = 'tutup';
    statusColor = 'slate';
  } else if (saturationPercentage >= 85 || (hoursUntilFull !== null && hoursUntilFull <= 2)) {
    status = 'hampir_penuh';
    statusColor = 'rose';
  } else if (saturationPercentage >= 65 || (hoursUntilFull !== null && hoursUntilFull <= 6)) {
    status = 'kritis';
    statusColor = 'amber';
  }
  
  return {
    totalQuota,
    filledQuota,
    remainingQuota,
    totalApplicants,
    saturationPercentage: Math.round(saturationPercentage * 10) / 10,
    applicantRatio: Math.round(applicantRatio * 100) / 100,
    burnRatePerHour: Math.round(burnRatePerHour * 10) / 10,
    hoursUntilFull,
    status,
    statusColor
  };
}
