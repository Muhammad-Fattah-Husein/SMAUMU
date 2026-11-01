/**
 * Portal API Service for SMAUMU
 * Supports Dual Backend Architecture:
 * 1. Supabase Cloud (Live PostgreSQL + Row Level Security + Realtime)
 * 2. Client-side LocalStorage DB fallback (when credentials not yet configured or offline preview)
 * 
 * Fully compatible with GitHub Pages static export (Zero server runtime requirement).
 */

import { db } from '@/services/db';
import { supabase, isSupabaseConfigured } from '@/services/supabaseClient';
import { detectGeoDiscrepancy } from '@/services/geoService';
import { generateTicketNumber, generateWhistleToken, sha256 } from '@/utils/crypto';
import { INITIAL_SEKOLAH } from '@/utils/constants';

class PortalApiService {
  // -------------------------------------------------------------
  // 1. KUOTA SEKOLAH & REAL-TIME BURN RATE
  // -------------------------------------------------------------
  async getKuota() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('kuota_sekolah')
          .select(`
            *,
            sekolah:sekolah_id (id, nama, npsn, alamat, lat, lng, akreditasi, zona_kecamatan)
          `)
          .order('sekolah_id', { ascending: true });

        if (!error && data && data.length > 0) {
          return { success: true, data, mode: 'supabase' };
        }
      } catch (err) {
        console.warn('Supabase getKuota fallback to local db:', err.message);
      }
    }

    const localData = db.getAllKuotaWithMetrics();
    return { success: true, data: localData, mode: 'local' };
  }

  async updateKuotaSeat(sekolahId, jalur, deltaApplicants = 1, deltaFilled = 0) {
    if (isSupabaseConfigured() && supabase) {
      try {
        // Fetch current row
        const { data: currentRows, error: fetchErr } = await supabase
          .from('kuota_sekolah')
          .select('*')
          .eq('sekolah_id', sekolahId)
          .eq('jalur', jalur);

        if (!fetchErr && currentRows && currentRows.length > 0) {
          const row = currentRows[0];
          const newFilled = Math.min(row.total_kuota, (row.kuota_terisi || 0) + deltaFilled);
          const newApplicants = (row.pendaftar_total || 0) + deltaApplicants;

          const { data: updated, error: updateErr } = await supabase
            .from('kuota_sekolah')
            .update({
              kuota_terisi: newFilled,
              pendaftar_total: newApplicants,
              updated_at: new Date().toISOString()
            })
            .eq('id', row.id)
            .select()
            .single();

          if (!updateErr && updated) {
            // Also update local db
            db.updateKuotaSeat(sekolahId, jalur, deltaApplicants, deltaFilled);
            return { success: true, data: updated, mode: 'supabase' };
          }
        }
      } catch (err) {
        console.warn('Supabase updateKuotaSeat fallback to local db:', err.message);
      }
    }

    const localUpdated = db.updateKuotaSeat(sekolahId, jalur, deltaApplicants, deltaFilled);
    return { success: true, data: localUpdated, mode: 'local' };
  }

  // -------------------------------------------------------------
  // 2. PENDAFTARAN SISWA (PUBLIC SERVICE TRACKING)
  // -------------------------------------------------------------
  async submitPendaftaran(formData) {
    const sekolahTarget = INITIAL_SEKOLAH.find(s => s.id === parseInt(formData.sekolah_id)) || INITIAL_SEKOLAH[0];
    const geoAnalysis = detectGeoDiscrepancy(
      sekolahTarget,
      formData.klaim_koordinat_lat || formData.klaim_lat,
      formData.klaim_koordinat_lng || formData.klaim_lng
    );

    const nomorTiket = formData.nomor_tiket || generateTicketNumber();

    const record = {
      nomor_tiket: nomorTiket,
      nama_siswa: formData.nama_siswa,
      nik: formData.nik,
      nisn: formData.nisn,
      nomor_telepon: formData.nomor_telepon || '',
      asal_sekolah_smp: formData.asal_sekolah_smp || 'SMP Terdaftar',
      alamat_domisili: formData.alamat_domisili || '',
      lama_tinggal_bulan: parseInt(formData.lama_tinggal_bulan) || 12,
      jalur: formData.jalur || 'zonasi',
      sekolah_id: parseInt(formData.sekolah_id) || 1,
      sekolah_cadangan_id: formData.sekolah_cadangan_id ? parseInt(formData.sekolah_cadangan_id) : null,
      
      klaim_koordinat_lat: parseFloat(formData.klaim_koordinat_lat || formData.klaim_lat) || sekolahTarget.lat,
      klaim_koordinat_lng: parseFloat(formData.klaim_koordinat_lng || formData.klaim_lng) || sekolahTarget.lng,
      klaim_jarak_meter: geoAnalysis.jarak_meter,
      klaim_nilai_rapor: parseFloat(formData.klaim_nilai_rapor) || 85.0,
      
      resmi_jarak_meter: geoAnalysis.jarak_meter,
      selisih_jarak_meter: geoAnalysis.selisih_meter,
      geo_anomaly_status: geoAnalysis.status,
      
      status_tahapan: 'diajukan',
      catatan_verifikasi: 'Pendaftaran mandiri berhasil diajukan, menunggu tinjauan berkas.'
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('pendaftaran')
          .insert([record])
          .select()
          .single();

        if (!error && data) {
          // Log to audit
          await this.recordAuditLog({
            pengguna_nama: record.nama_siswa + ' (Pendaftar)',
            aksi: 'PENGAJUAN_PENDAFTARAN',
            entitas_terkait: 'pendaftaran',
            entitas_id: data.id,
            deskripsi_tindakan: `Pengajuan berkas baru via jalur ${record.jalur} - Tiket: ${nomorTiket}`,
            data_baru: { tiket: nomorTiket, jalur: record.jalur, status: record.status_tahapan }
          });

          // Sync locally
          db.addPendaftaran({ ...record, id: data.id });
          return { success: true, data, mode: 'supabase' };
        }
      } catch (err) {
        console.warn('Supabase submitPendaftaran fallback to local db:', err.message);
      }
    }

    // Local DB fallback
    const localCreated = db.addPendaftaran(record);
    return { success: true, data: localCreated, mode: 'local' };
  }

  async getPendaftaranByTicket(ticketNumber) {
    if (!ticketNumber) return { success: false, message: 'Nomor tiket tidak valid' };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('pendaftaran')
          .select(`
            *,
            sekolah:sekolah_id (id, nama, npsn, alamat, lat, lng, radius_zonasi_maksimal_m)
          `)
          .eq('nomor_tiket', ticketNumber.trim())
          .single();

        if (!error && data) {
          return { success: true, data, mode: 'supabase' };
        }
      } catch (err) {
        console.warn('Supabase getPendaftaranByTicket fallback to local db:', err.message);
      }
    }

    const localRecord = db.getPendaftaranByTiket(ticketNumber.trim());
    if (localRecord) {
      return { success: true, data: localRecord, mode: 'local' };
    }
    return { success: false, message: 'Nomor tiket tidak ditemukan' };
  }

  async getAllPendaftaran() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('pendaftaran')
          .select(`
            *,
            sekolah:sekolah_id (id, nama, npsn, alamat, lat, lng)
          `)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return { success: true, data, mode: 'supabase' };
        }
      } catch (err) {
        console.warn('Supabase getAllPendaftaran fallback to local db:', err.message);
      }
    }

    return { success: true, data: db.getAllPendaftaran(), mode: 'local' };
  }

  async verifyPendaftaran(id, status, verifikator = 'Dr. H. Bambang Soeprapto', catatan = '') {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('pendaftaran')
          .update({
            status_tahapan: status,
            catatan_verifikasi: catatan || `Status diperbarui menjadi ${status} oleh ${verifikator}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          await this.recordAuditLog({
            pengguna_nama: verifikator,
            aksi: `VERIFIKASI_${status.toUpperCase()}`,
            entitas_terkait: 'pendaftaran',
            entitas_id: id,
            deskripsi_tindakan: `Pembaruan status tiket ${data.nomor_tiket} menjadi [${status}]. Catatan: ${catatan}`,
            data_baru: { status, catatan, verifikator }
          });

          db.updatePendaftaranStatus(id, status, verifikator, catatan);
          return { success: true, data, mode: 'supabase' };
        }
      } catch (err) {
        console.warn('Supabase verifyPendaftaran fallback to local db:', err.message);
      }
    }

    const localUpdated = db.updatePendaftaranStatus(id, status, verifikator, catatan);
    return { success: true, data: localUpdated, mode: 'local' };
  }

  // -------------------------------------------------------------
  // 3. CIVIC WHISTLEBLOWER & LAPORAN WARGA
  // -------------------------------------------------------------
  async submitWhistleblower(reportData) {
    const tokenInvestigasi = generateWhistleToken();
    const kodeLaporan = `WBL-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReport = {
      kode_laporan: kodeLaporan,
      token_investigasi: tokenInvestigasi,
      kategori: reportData.kategori,
      sekolah_terlapor_id: reportData.sekolah_terlapor_id ? parseInt(reportData.sekolah_terlapor_id) : null,
      tiket_terlapor: reportData.tiket_terlapor || null,
      judul: reportData.judul,
      deskripsi: reportData.deskripsi,
      bukti_lampiran_url: reportData.bukti_lampiran_url || null,
      status: 'dikirim',
      tindakan_diambil: 'Laporan terenkripsi diterima sistem. Menunggu penjadwalan audit tim independen.',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('laporan_warga')
          .insert([newReport])
          .select()
          .single();

        if (!error && data) {
          await this.recordAuditLog({
            pengguna_nama: 'Civic Whistleblower (Anonim)',
            aksi: 'SUBMIT_CIVIC_REPORT',
            entitas_terkait: 'laporan_warga',
            entitas_id: data.id,
            deskripsi_tindakan: `Penerimaan laporan dugaan kecurangan [${data.kategori}]: ${data.judul}`,
            data_baru: { kode: kodeLaporan, kategori: data.kategori }
          });

          db.addLaporanWarga({ ...newReport, id: data.id });
          return { success: true, data, token_investigasi: tokenInvestigasi, mode: 'supabase' };
        }
      } catch (err) {
        console.warn('Supabase submitWhistleblower fallback to local db:', err.message);
      }
    }

    const localAdded = db.addLaporanWarga(newReport);
    return { success: true, data: localAdded, token_investigasi: tokenInvestigasi, mode: 'local' };
  }

  async getWhistleblowerByToken(token) {
    if (!token) return { success: false, message: 'Token investigasi tidak valid' };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('laporan_warga')
          .select('*')
          .eq('token_investigasi', token.trim())
          .single();

        if (!error && data) {
          return { success: true, data, mode: 'supabase' };
        }
      } catch (err) {
        console.warn('Supabase getWhistleblowerByToken fallback to local db:', err.message);
      }
    }

    const localReport = db.getLaporanByToken(token.trim());
    if (localReport) {
      return { success: true, data: localReport, mode: 'local' };
    }
    return { success: false, message: 'Token investigasi tidak ditemukan' };
  }

  async getAllWhistleblower() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('laporan_warga')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return { success: true, data, mode: 'supabase' };
        }
      } catch (err) {
        console.warn('Supabase getAllWhistleblower fallback to local db:', err.message);
      }
    }

    return { success: true, data: db.getAllLaporanWarga(), mode: 'local' };
  }

  async updateWhistleblowerStatus(id, status, responPetugas) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('laporan_warga')
          .update({
            status,
            tindakan_diambil: responPetugas,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          await this.recordAuditLog({
            pengguna_nama: 'Tim Penindak Anomali Disdik',
            aksi: `TINDAK_LANJUT_LAPORAN_${status.toUpperCase()}`,
            entitas_terkait: 'laporan_warga',
            entitas_id: id,
            deskripsi_tindakan: `Pembaruan status laporan warga [${data.kode_laporan}] menjadi ${status}`,
            data_baru: { status, responPetugas }
          });

          db.updateLaporanStatus(id, status, responPetugas);
          return { success: true, data, mode: 'supabase' };
        }
      } catch (err) {
        console.warn('Supabase updateWhistleblowerStatus fallback to local db:', err.message);
      }
    }

    const localUpdated = db.updateLaporanStatus(id, status, responPetugas);
    return { success: true, data: localUpdated, mode: 'local' };
  }

  // -------------------------------------------------------------
  // 4. IMMUTABLE PUBLIC AUDIT LOG & CRYPTOGRAPHIC VERIFICATION
  // -------------------------------------------------------------
  async getAuditLogs() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('audit_log')
          .select('*')
          .order('id', { ascending: false });

        if (!error && data && data.length > 0) {
          return { success: true, data, mode: 'supabase' };
        }
      } catch (err) {
        console.warn('Supabase getAuditLogs fallback to local db:', err.message);
      }
    }

    return { success: true, data: db.getAuditLogs(), mode: 'local' };
  }

  async verifyAuditIntegrity() {
    return db.verifyAuditIntegrity();
  }

  async recordAuditLog(logPayload) {
    const logs = db.getAuditLogs();
    const prevHash = logs.length > 0 ? logs[0].curr_hash : '0000000000000000000000000000000000000000000000000000000000000000';
    const timestamp = new Date().toISOString();
    const currHash = sha256(`${prevHash}:${logPayload.aksi}:${logPayload.entitas_terkait}:${timestamp}`);

    const newLog = {
      pengguna_id: 1,
      pengguna_nama: logPayload.pengguna_nama || 'Petugas Sistem',
      aksi: logPayload.aksi,
      entitas_terkait: logPayload.entitas_terkait || 'umum',
      entitas_id: logPayload.entitas_id || 0,
      deskripsi_tindakan: logPayload.deskripsi_tindakan,
      data_lama: logPayload.data_lama || null,
      data_baru: logPayload.data_baru || null,
      ip_address: '127.0.0.1 (Web Portal)',
      prev_hash: prevHash,
      curr_hash: currHash,
      created_at: timestamp
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('audit_log').insert([newLog]);
      } catch (err) {
        console.warn('Failed to insert audit log to Supabase:', err.message);
      }
    }

    db.addAuditLog(newLog);
    return newLog;
  }
}

export const portalApi = new PortalApiService();
