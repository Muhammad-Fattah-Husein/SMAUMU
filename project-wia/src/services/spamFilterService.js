/**
 * Spam & False Report Mitigation Engine (Civic Whistleblower Anti-Spam)
 * Evaluates authenticity, evidence validity, and ticket registration in PPDB database
 * Web In Action (WIA) MIA 2026 - Tim FounDred
 */

import { db } from '@/services/db';

/**
 * Menghitung skor risiko spam laporan (0% - 100%)
 * 0 - 29%   : Kredibel / Prioritas Tinggi (Aduan Otentik dengan Bukti)
 * 30 - 69%  : Menengah / Butuh Telaah Tambahan
 * 70 - 100% : Risiko Tinggi (Aduan Palsu / Spam / Tanpa Bukti)
 */
export function calculateSpamRiskScore(report, allPendaftaranList = null) {
  let score = 50; // Skor awal netral
  const reasons = [];

  const registeredTickets = (allPendaftaranList || db.getAllPendaftaran()).map(p => 
    (p.nomor_tiket || '').trim().toUpperCase()
  );

  const cleanTicket = (report.tiket_terkait || '').trim().toUpperCase();
  const cleanDesc = (report.deskripsi || '').trim();
  const cleanTitle = (report.judul || '').trim();
  const hasEvidence = Boolean(report.lampiran_bukti_url);

  // 1. Analisis Lampiran Bukti Dokumen (+35 Poin Kredibilitas jika ada)
  if (hasEvidence) {
    score -= 35;
    reasons.push('✓ Menyertakan lampiran dokumen bukti otentik (foto/PDF)');
  } else {
    score += 25;
    reasons.push('⚠️ Tidak ada lampiran dokumen fisik atau foto bukti lapangan');
  }

  // 2. Analisis Validitas Nomor Tiket PPDB
  if (cleanTicket && cleanTicket !== '-' && !cleanTicket.includes('UMUM')) {
    const isMatched = registeredTickets.includes(cleanTicket);
    if (isMatched) {
      score -= 30;
      reasons.push(`✓ Nomor tiket ${cleanTicket} terdaftar resmi di basis data PPDB`);
    } else if (cleanTicket.includes('FIKTIF') || cleanTicket.length < 8) {
      score += 40;
      reasons.push(`✕ Nomor tiket ${cleanTicket} fiktif / tidak ditemukan di sistem`);
    } else {
      score += 15;
      reasons.push(`⚠️ Nomor tiket ${cleanTicket} membutuhkan konfirmasi manual dinas`);
    }
  } else {
    score += 10;
    reasons.push('ℹ Laporan umum tanpa mencantumkan nomor tiket spesifik');
  }

  // 3. Analisis Kedalaman Narasi & Kosa Kata Kronologi
  if (cleanDesc.length >= 100) {
    score -= 15;
    reasons.push(`✓ Narasi kronologi mendalam dan runtut (${cleanDesc.length} karakter)`);
  } else if (cleanDesc.length < 40) {
    score += 25;
    reasons.push(`✕ Deskripsi sangat singkat & minim konteks faktual (${cleanDesc.length} karakter)`);
  }

  // Deteksi kata kunci kredibel
  const credibleKeywords = ['kk', 'kartu keluarga', 'rt', 'rw', 'dukcapil', 'piagam', 'sertifikat', 'jarak', 'meter', 'zonasi', 'kelurahan', 'kecamatan', 'lurah', 'panitia'];
  const matchedKeywords = credibleKeywords.filter(k => 
    cleanDesc.toLowerCase().includes(k) || cleanTitle.toLowerCase().includes(k)
  );

  if (matchedKeywords.length >= 3) {
    score -= 15;
    reasons.push(`✓ Memuat istilah administratif valid: ${matchedKeywords.slice(0, 3).join(', ')}`);
  } else if (matchedKeywords.length === 0) {
    score += 15;
    reasons.push('⚠️ Tidak memuat indikator istilah faktual administratif');
  }

  // 4. Deteksi Pola Emosi Fitnah & Repetisi Spam
  const spamPatterns = ['calo calo', 'curang parah', 'tangkap', 'penjara', 'woi', 'palsu semua'];
  const hasSpamPattern = spamPatterns.some(p => cleanDesc.toLowerCase().includes(p));
  if (hasSpamPattern) {
    score += 20;
    reasons.push('⚠️ Terdeteksi gaya bahasa repetitif / nada provokasi tanpa rincian kronologi');
  }

  // Normalisasi skor batas 0 - 100
  const finalScore = Math.max(5, Math.min(98, Math.round(score)));

  let riskLevel = 'RENDAH';
  let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let statusMitigasi = 'prioritas_investigasi';
  let rekomendasi = 'Laporan kredibel. Prioritas eskalasi ke tim inspektorat dinas lapangan.';

  if (finalScore >= 70) {
    riskLevel = 'TINGGI';
    badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';
    statusMitigasi = 'termitigasi_spam';
    rekomendasi = 'Risiko laporan palsu / spam tinggi. Otomatis dikarantina agar tidak membebani pemeriksa.';
  } else if (finalScore >= 35) {
    riskLevel = 'SEDANG';
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    statusMitigasi = 'perlu_klarifikasi';
    rekomendasi = 'Kredibilitas cukup. Perlu verifikasi berkas awal sebelum inspeksi ke lokasi.';
  }

  return {
    score: finalScore,
    riskLevel,
    badgeColor,
    statusMitigasi,
    rekomendasi,
    reasons,
    isSpam: finalScore >= 70
  };
}
