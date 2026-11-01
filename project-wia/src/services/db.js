/**
 * Central Relational Database Store
 * SMAUMU - Web In Action (WIA) MIA 2026
 * Implements 1:N relations and synchronous/asynchronous data operations
 */

import { INITIAL_SEKOLAH } from '@/utils/constants';
import { AuditChain } from './auditService';
import { calculateBurnRateMetrics } from './quotaService';
import { detectGeoDiscrepancy } from './geoService';

// Initial audit logs seeded with tamper-evident chain
const initialAuditEntries = [
  {
    id: 1,
    pengguna_id: 1,
    pengguna_nama: 'Admin Disdik WIA Pusat',
    aksi: 'GENESIS_SYSTEM_INIT',
    entitas_terkait: 'sistem',
    entitas_id: 0,
    deskripsi_tindakan: 'Inisialisasi Master Kuota & Regulasi Zonasi WIA 2026',
    data_lama: null,
    data_baru: { versi: '1.0', status: 'aktif' },
    ip_address: '10.0.0.1',
    prev_hash: '0000000000000000000000000000000000000000000000000000000000000000',
    curr_hash: '8f7d98c21345efbb67a890123456789abcdef0123456789abcdef0123456789a',
    created_at: '2026-10-30T08:00:00.000Z'
  },
  {
    id: 2,
    pengguna_id: 2,
    pengguna_nama: 'Dr. H. Bambang Soeprapto (Verifikator)',
    aksi: 'FLAG_GEO_DISCREPANCY',
    entitas_terkait: 'pendaftaran',
    entitas_id: 2,
    deskripsi_tindakan: 'Pemberian Status Anomali Kritis (Selisih > 1km) pada Tiket TIKET-SMU-2026-098215',
    data_lama: { status_tahapan: 'diajukan', geo_anomaly_status: 'aman' },
    data_baru: { status_tahapan: 'tinjauan_manual', geo_anomaly_status: 'anomali_kritis_fraud' },
    ip_address: '192.168.1.45',
    prev_hash: '8f7d98c21345efbb67a890123456789abcdef0123456789abcdef0123456789a',
    curr_hash: '3a1b4c9e887766554433221100ffeeddccbbaa99887766554433221100ffeedd',
    created_at: '2026-10-31T09:15:22.000Z'
  }
];

class DatabaseService {
  constructor() {
    this.sekolah = [...INITIAL_SEKOLAH];
    
    this.pengguna = [
      { id: 1, nama: 'Admin Disdik WIA Pusat', email: 'admin.disdik@smaumu.go.id', peran: 'admin_instansi', nip: '198503212008011002' },
      { id: 2, nama: 'Dr. H. Bambang Soeprapto', email: 'verifikator.zonasi@smaumu.go.id', peran: 'verifikator_zonasi', nip: '197906152005021004' },
      { id: 3, nama: 'Ombudsman Publik Pelapor', email: 'auditor.bebas@ombudsman.go.id', peran: 'auditor_publik', nip: '198811122012012001' },
      { id: 4, nama: 'Siti Nurhaliza (Orang Tua)', email: 'siti.nurhaliza@gmail.com', peran: 'masyarakat', nip: null },
      { id: 5, nama: 'Budi Wicaksono (Orang Tua)', email: 'budi.wicak@gmail.com', peran: 'masyarakat', nip: null }
    ];

    this.kuota_sekolah = [
      { id: 1, sekolah_id: 1, pengguna_id: 1, jalur: 'zonasi', persentase: 50, total_kuota: 144, kuota_terisi: 118, pendaftar_total: 230, burn_rate_per_jam: 8.4 },
      { id: 2, sekolah_id: 1, pengguna_id: 1, jalur: 'afirmasi', persentase: 20, total_kuota: 58, kuota_terisi: 41, pendaftar_total: 62, burn_rate_per_jam: 2.1 },
      { id: 3, sekolah_id: 1, pengguna_id: 1, jalur: 'prestasi_akademik', persentase: 20, total_kuota: 58, kuota_terisi: 54, pendaftar_total: 142, burn_rate_per_jam: 6.5 },
      { id: 4, sekolah_id: 1, pengguna_id: 1, jalur: 'perpindahan_tugas', persentase: 10, total_kuota: 28, kuota_terisi: 12, pendaftar_total: 16, burn_rate_per_jam: 0.8 },
      
      { id: 5, sekolah_id: 2, pengguna_id: 1, jalur: 'zonasi', persentase: 50, total_kuota: 180, kuota_terisi: 164, pendaftar_total: 390, burn_rate_per_jam: 14.2 },
      { id: 6, sekolah_id: 2, pengguna_id: 1, jalur: 'prestasi_akademik', persentase: 25, total_kuota: 90, kuota_terisi: 88, pendaftar_total: 310, burn_rate_per_jam: 11.0 },
      { id: 7, sekolah_id: 2, pengguna_id: 1, jalur: 'afirmasi', persentase: 15, total_kuota: 54, kuota_terisi: 39, pendaftar_total: 58, burn_rate_per_jam: 2.4 },
      { id: 8, sekolah_id: 2, pengguna_id: 1, jalur: 'perpindahan_tugas', persentase: 10, total_kuota: 36, kuota_terisi: 18, pendaftar_total: 22, burn_rate_per_jam: 1.1 },

      { id: 9, sekolah_id: 3, pengguna_id: 1, jalur: 'zonasi', persentase: 50, total_kuota: 162, kuota_terisi: 110, pendaftar_total: 195, burn_rate_per_jam: 7.3 },
      { id: 10, sekolah_id: 4, pengguna_id: 1, jalur: 'zonasi', persentase: 50, total_kuota: 144, kuota_terisi: 98, pendaftar_total: 180, burn_rate_per_jam: 6.2 },
      { id: 11, sekolah_id: 5, pengguna_id: 1, jalur: 'zonasi', persentase: 50, total_kuota: 180, kuota_terisi: 150, pendaftar_total: 280, burn_rate_per_jam: 9.8 },
      { id: 12, sekolah_id: 6, pengguna_id: 1, jalur: 'zonasi', persentase: 50, total_kuota: 160, kuota_terisi: 135, pendaftar_total: 260, burn_rate_per_jam: 8.9 }
    ];

    this.pendaftaran = [
      {
        id: 1,
        nomor_tiket: 'TIKET-SMU-2026-098214',
        pengguna_id: 4,
        sekolah_id: 1,
        sekolah_nama: 'SMAN 1 Jakarta (Boedoet)',
        jalur: 'zonasi',
        nama_siswa: 'Aditya Pratama Putra',
        nik: '3171012304090001',
        nisn: '0089123456',
        asal_sekolah_smp: 'SMPN 1 Jakarta',
        alamat_domisili: 'Jl. Budi Utomo No. 12, Sawah Besar, Jakarta Pusat',
        lama_tinggal_bulan: 26,
        
        // Claimed vs Official Coordinates
        klaim_lat: -6.167200,
        klaim_lng: 106.837800,
        resmi_lat: -6.167210,
        resmi_lng: 106.837820,
        jarak_klaim_meter: 120.5,
        jarak_resmi_meter: 124.2,
        selisih_jarak_meter: 3.7,
        geo_anomaly_status: 'aman',
        
        // Academic Comparator
        klaim_nilai_rapor: 88.50,
        dapodik_nilai_rapor: 88.50,
        dual_truth_status: 'terverifikasi_cocok',
        
        status_tahapan: 'diterima_resmi',
        catatan_verifikator: 'Validasi NIK Dukcapil & Geocoding cocok sempurna.',
        created_at: '2026-10-30T10:20:00.000Z'
      },
      {
        id: 2,
        nomor_tiket: 'TIKET-SMU-2026-098215',
        pengguna_id: 5,
        sekolah_id: 2,
        sekolah_nama: 'SMAN 8 Jakarta (Bukit Duri)',
        jalur: 'zonasi',
        nama_siswa: 'Reyhan Bagas Saputra',
        nik: '3174021208090004',
        nisn: '0087654321',
        asal_sekolah_smp: 'SMPN 115 Jakarta',
        alamat_domisili: 'Jl. Bukit Duri Tanjakan No. 44, Tebet, Jakarta Selatan',
        lama_tinggal_bulan: 4, // Under 1 year -> Warning
        
        // Claimed vs Official Coordinates
        klaim_lat: -6.224100,
        klaim_lng: 106.859200,
        resmi_lat: -6.234500,
        resmi_lng: 106.871000,
        jarak_klaim_meter: 310.0,
        jarak_resmi_meter: 1680.0,
        selisih_jarak_meter: 1370.0, // Critical anomaly
        geo_anomaly_status: 'anomali_kritis_fraud',
        
        // Academic Comparator
        klaim_nilai_rapor: 91.20,
        dapodik_nilai_rapor: 85.00,
        dual_truth_status: 'inkonsistensi_kritis',
        
        status_tahapan: 'tinjauan_manual',
        catatan_verifikator: 'Geo-Discrepancy terdeteksi 1.370 meter! Diduga geser pin GPS & Numpang KK < 1 tahun. Nilai rapor berbeda 6.2 poin.',
        created_at: '2026-10-31T08:45:00.000Z'
      },
      {
        id: 3,
        nomor_tiket: 'TIKET-SMU-2026-098216',
        pengguna_id: 4,
        sekolah_id: 3,
        sekolah_nama: 'SMAN 34 Jakarta (Pondok Labu)',
        jalur: 'prestasi_akademik',
        nama_siswa: 'Nadia Putri Maharani',
        nik: '3174094406090002',
        nisn: '0089887766',
        asal_sekolah_smp: 'SMPN 68 Jakarta',
        alamat_domisili: 'Jl. Margasatwa Barat No. 8, Cilandak, Jakarta Selatan',
        lama_tinggal_bulan: 18,
        
        klaim_lat: -6.312500,
        klaim_lng: 106.801200,
        resmi_lat: -6.312800,
        resmi_lng: 106.801600,
        jarak_klaim_meter: 280.0,
        jarak_resmi_meter: 325.0,
        selisih_jarak_meter: 45.0,
        geo_anomaly_status: 'aman',
        
        klaim_nilai_rapor: 94.80,
        dapodik_nilai_rapor: 94.80,
        dual_truth_status: 'terverifikasi_cocok',
        
        status_tahapan: 'lolos_sementara',
        catatan_verifikator: 'Berkas dan Piagam Juara 1 OSN Matematika terverifikasi Puspresnas.',
        created_at: '2026-10-31T09:30:00.000Z'
      },
      {
        id: 4,
        nomor_tiket: 'TIKET-SMU-2026-098217',
        pengguna_id: 5,
        sekolah_id: 4,
        sekolah_nama: 'SMAN 28 Jakarta (Pasar Minggu)',
        jalur: 'zonasi',
        nama_siswa: 'Farhan Dwi Cahyo',
        nik: '3174081105090003',
        nisn: '0086543219',
        asal_sekolah_smp: 'SMPN 41 Jakarta',
        alamat_domisili: 'Jl. Sawo Manila No. 19, Pejaten Barat, Pasar Minggu',
        lama_tinggal_bulan: 14,
        
        klaim_lat: -6.287200,
        klaim_lng: 106.832100,
        resmi_lat: -6.288900,
        resmi_lng: 106.834100,
        jarak_klaim_meter: 410.0,
        jarak_resmi_meter: 680.0,
        selisih_jarak_meter: 270.0,
        geo_anomaly_status: 'peringatan_toleransi',
        
        klaim_nilai_rapor: 87.20,
        dapodik_nilai_rapor: 87.00,
        dual_truth_status: 'perbedaan_ringan',
        
        status_tahapan: 'verifikasi_gis',
        catatan_verifikator: 'Deviasi toleransi 270 meter. Petugas GIS sedang mengecek titik batas gang perumahan.',
        created_at: '2026-10-31T10:00:00.000Z'
      }
    ];

    this.laporan_warga = [
      {
        id: 1,
        kode_laporan: 'WBL-2026-88192',
        pengguna_id: 5,
        pendaftaran_id: 2,
        tiket_terkait: 'TIKET-SMU-2026-098215',
        kategori: 'manipulasi_koordinat',
        judul: 'Indikasi Pemalsuan Titik Rumah pada Pendaftaran SMAN 8',
        deskripsi: 'Pendaftar dengan NIK 3174021208090004 mencantumkan rumah di Jl. Bukit Duri Tanjakan, padahal fakta lapangan keluarga tersebut tinggal di Rawamangun dan baru menumpang KK pada Mei 2026.',
        lampiran_bukti_url: '/bukti/foto_rumah_rawamangun.jpg',
        is_anonim: true,
        nama_samaran: 'Warga Peduli Zonasi Adil',
        token_investigasi: 'TOKEN-WBL-7719-XPQ',
        status: 'dalam_investigasi',
        respon_petugas: 'Laporan diverifikasi awal. Petugas zonasi lapangan telah diterjunkan ke alamat Bukit Duri.',
        created_at: '2026-10-31T09:00:00.000Z'
      },
      {
        id: 2,
        kode_laporan: 'WBL-2026-88193',
        pengguna_id: null,
        pendaftaran_id: null,
        tiket_terkait: 'Umum - Wilayah Tebet',
        kategori: 'numpang_kk',
        judul: 'Satu Rumah Ditumpangi 6 Siswa SMP Berbeda untuk SMAN 8',
        deskripsi: 'Ditemukan indikasi 1 KK di Bukit Duri Dalam berisikan 6 nama anak dengan usia sama (kelahiran 2009-2010) dengan status Hubungan Dalam Keluarga: Famili Lain.',
        lampiran_bukti_url: '/bukti/scan_kk_anomali.pdf',
        is_anonim: true,
        nama_samaran: 'Civic Watcher 2026',
        token_investigasi: 'TOKEN-WBL-8820-KLP',
        status: 'bukti_valid_terverifikasi',
        respon_petugas: 'Dinas Dukcapil dan Disdik telah membekukan 6 NIK tersebut dari kuota zonasi dan dialihkan ke jalur prestasi.',
        created_at: '2026-10-31T09:45:00.000Z'
      }
    ];

    this.auditChain = new AuditChain(initialAuditEntries);
  }

  // --- SEKOLAH ---
  getAllSekolah() {
    return this.sekolah;
  }

  getSekolahById(id) {
    return this.sekolah.find(s => s.id === parseInt(id));
  }

  // --- KUOTA ---
  getAllKuotaWithMetrics() {
    return this.kuota_sekolah.map(k => {
      const school = this.sekolah.find(s => s.id === k.sekolah_id);
      const metrics = calculateBurnRateMetrics(k.total_kuota, k.kuota_terisi, k.pendaftar_total, k.burn_rate_per_jam);
      return {
        ...k,
        sekolah_nama: school ? school.nama_sekolah : `SMAN ${k.sekolah_id}`,
        sekolah_alamat: school ? school.alamat : '',
        metrics
      };
    });
  }

  updateKuotaSeat(sekolahId, jalur, deltaApplicants = 1, deltaFilled = 1) {
    const item = this.kuota_sekolah.find(k => k.sekolah_id === parseInt(sekolahId) && k.jalur === jalur);
    if (item) {
      const oldVal = { ...item };
      item.pendaftar_total += deltaApplicants;
      item.kuota_terisi = Math.min(item.total_kuota, item.kuota_terisi + deltaFilled);
      item.burn_rate_per_jam = parseFloat((item.burn_rate_per_jam + 0.3).toFixed(1));

      // Append to audit log
      this.auditChain.addEntry({
        penggunaId: 1,
        penggunaNama: 'Sistem Sinkronisasi Kuota',
        aksi: 'UPDATE_KUOTA_LIVE',
        entitas: 'kuota_sekolah',
        entitasId: item.id,
        deskripsi: `Pembaruan kuota ${item.jalur} di SMAN ID ${sekolahId}: terisi ${item.kuota_terisi}/${item.total_kuota}`,
        dataLama: oldVal,
        dataBaru: item
      });
      return item;
    }
    return null;
  }

  // --- PENDAFTARAN ---
  getAllPendaftaran() {
    return this.pendaftaran;
  }

  getPendaftaranByTiket(nomorTiket) {
    return this.pendaftaran.find(p => p.nomor_tiket.toLowerCase() === nomorTiket.trim().toLowerCase());
  }

  addPendaftaran(data) {
    const school = this.getSekolahById(data.sekolah_id);
    const schoolLat = school ? school.lat : -6.2088;
    const schoolLng = school ? school.lng : 106.8456;

    // Run Geo-Discrepancy Engine
    const geoAnalysis = detectGeoDiscrepancy(
      data.klaim_lat,
      data.klaim_lng,
      data.resmi_lat || data.klaim_lat,
      data.resmi_lng || data.klaim_lng,
      schoolLat,
      schoolLng
    );

    // Run Dual-Truth Academic comparator
    let dualTruthStatus = 'terverifikasi_cocok';
    const raporDiff = Math.abs((data.klaim_nilai_rapor || 0) - (data.dapodik_nilai_rapor || data.klaim_nilai_rapor || 0));
    if (raporDiff > 5.0 || (data.lama_tinggal_bulan && data.lama_tinggal_bulan < 12)) {
      dualTruthStatus = 'inkonsistensi_kritis';
    } else if (raporDiff > 1.0) {
      dualTruthStatus = 'perbedaan_ringan';
    }

    const newRecord = {
      id: this.pendaftaran.length + 1,
      nomor_tiket: data.nomor_tiket,
      pengguna_id: data.pengguna_id || 4,
      sekolah_id: parseInt(data.sekolah_id),
      sekolah_nama: school ? school.nama_sekolah : 'SMAN Pilihan',
      jalur: data.jalur,
      nama_siswa: data.nama_siswa,
      nik: data.nik,
      nisn: data.nisn,
      asal_sekolah_smp: data.asal_sekolah_smp,
      alamat_domisili: data.alamat_domisili,
      lama_tinggal_bulan: parseInt(data.lama_tinggal_bulan) || 24,

      klaim_lat: data.klaim_lat,
      klaim_lng: data.klaim_lng,
      resmi_lat: data.resmi_lat || data.klaim_lat,
      resmi_lng: data.resmi_lng || data.klaim_lng,
      jarak_klaim_meter: geoAnalysis.claimedDistanceToSchool,
      jarak_resmi_meter: geoAnalysis.verifiedDistanceToSchool,
      selisih_jarak_meter: geoAnalysis.discrepancyDeltaMeters,
      geo_anomaly_status: geoAnalysis.anomalyStatus,

      klaim_nilai_rapor: parseFloat(data.klaim_nilai_rapor) || 85.0,
      dapodik_nilai_rapor: parseFloat(data.dapodik_nilai_rapor) || parseFloat(data.klaim_nilai_rapor) || 85.0,
      dual_truth_status: dualTruthStatus,

      status_tahapan: geoAnalysis.anomalyStatus === 'anomali_kritis_fraud' ? 'tinjauan_manual' : 'diajukan',
      catatan_verifikator: geoAnalysis.anomalyStatus === 'anomali_kritis_fraud' 
        ? `Sistem mendeteksi anomali jarak ${geoAnalysis.discrepancyDeltaMeters}m. Membutuhkan verifikasi fisik.`
        : 'Pendaftaran berhasil dikirim. Menunggu verifikasi berkas.',
      created_at: new Date().toISOString()
    };

    this.pendaftaran.unshift(newRecord);

    // Update Quota Seat Count
    this.updateKuotaSeat(data.sekolah_id, data.jalur, 1, 0);

    // Append to Audit Chain
    this.auditChain.addEntry({
      penggunaId: data.pengguna_id || 4,
      penggunaNama: data.nama_siswa,
      aksi: 'PENDAFTARAN_BARU',
      entitas: 'pendaftaran',
      entitasId: newRecord.id,
      deskripsi: `Pendaftaran baru diajukan: ${newRecord.nomor_tiket} - ${newRecord.nama_siswa} (${newRecord.jalur})`,
      dataLama: null,
      dataBaru: {
        nomor_tiket: newRecord.nomor_tiket,
        jarak_klaim: newRecord.jarak_klaim_meter,
        geo_status: newRecord.geo_anomaly_status
      }
    });

    return newRecord;
  }

  updatePendaftaranStatus(id, newStatus, verifikatorNama = 'Dr. H. Bambang Soeprapto', catatan = '') {
    const record = this.pendaftaran.find(p => p.id === parseInt(id));
    if (record) {
      const oldVal = { status_tahapan: record.status_tahapan, catatan: record.catatan_verifikator };
      record.status_tahapan = newStatus;
      if (catatan) record.catatan_verifikator = catatan;
      record.updated_at = new Date().toISOString();

      // Audit Log
      this.auditChain.addEntry({
        penggunaId: 2,
        penggunaNama: verifikatorNama,
        aksi: 'VERIFIKASI_STATUS_TIKET',
        entitas: 'pendaftaran',
        entitasId: record.id,
        deskripsi: `Pembaruan status tiket ${record.nomor_tiket} (${record.nama_siswa}) menjadi "${newStatus}"`,
        dataLama: oldVal,
        dataBaru: { status_tahapan: newStatus, catatan: record.catatan_verifikator }
      });

      return record;
    }
    return null;
  }

  // --- CIVIC WHISTLEBLOWER ---
  getAllLaporanWarga() {
    return this.laporan_warga;
  }

  getLaporanByToken(token) {
    return this.laporan_warga.find(l => l.token_investigasi.toLowerCase() === token.trim().toLowerCase());
  }

  addLaporanWarga(data) {
    const newLaporan = {
      id: this.laporan_warga.length + 1,
      kode_laporan: data.kode_laporan,
      pengguna_id: data.pengguna_id || null,
      pendaftaran_id: data.pendaftaran_id || null,
      tiket_terkait: data.tiket_terkait || 'Tidak Disebutkan',
      kategori: data.kategori,
      judul: data.judul,
      deskripsi: data.deskripsi,
      lampiran_bukti_url: data.lampiran_bukti_url || '/bukti/laporan_dokumen.pdf',
      is_anonim: data.is_anonim !== false,
      nama_samaran: data.nama_samaran || 'Warga Anonim Transparan',
      token_investigasi: data.token_investigasi,
      status: 'diterima',
      respon_petugas: 'Laporan warga telah masuk dalam antrean audit transparansi dinas.',
      created_at: new Date().toISOString()
    };

    this.laporan_warga.unshift(newLaporan);

    // Audit Log for civic report
    this.auditChain.addEntry({
      penggunaId: 3,
      penggunaNama: newLaporan.nama_samaran,
      aksi: 'CIVIC_WHISTLEBLOWER_SUBMIT',
      entitas: 'laporan_warga',
      entitasId: newLaporan.id,
      deskripsi: `Laporan warga baru diterima: ${newLaporan.kode_laporan} [Kategori: ${newLaporan.kategori}]`,
      dataLama: null,
      dataBaru: { kode_laporan: newLaporan.kode_laporan, judul: newLaporan.judul }
    });

    return newLaporan;
  }

  updateLaporanStatus(id, newStatus, responPetugas) {
    const report = this.laporan_warga.find(l => l.id === parseInt(id));
    if (report) {
      const oldVal = { status: report.status, respon: report.respon_petugas };
      report.status = newStatus;
      report.respon_petugas = responPetugas || report.respon_petugas;
      report.updated_at = new Date().toISOString();

      this.auditChain.addEntry({
        penggunaId: 1,
        penggunaNama: 'Admin Disdik WIA',
        aksi: 'RESPON_LAPORAN_WARGA',
        entitas: 'laporan_warga',
        entitasId: report.id,
        deskripsi: `Tindak lanjut laporan ${report.kode_laporan}: status diubah menjadi "${newStatus}"`,
        dataLama: oldVal,
        dataBaru: { status: newStatus, respon: report.respon_petugas }
      });

      return report;
    }
    return null;
  }

  // --- IMMUTABLE AUDIT LOG ---
  getAuditLogs() {
    return this.auditChain.getLogs();
  }

  verifyAuditIntegrity() {
    return this.auditChain.verifyIntegrity();
  }
}

// Global Singleton to maintain state across Hot Reloads & API calls
const globalKey = Symbol.for('SMAUMU_DATABASE_SINGLETON');
if (!global[globalKey]) {
  global[globalKey] = new DatabaseService();
}

export const db = global[globalKey];
