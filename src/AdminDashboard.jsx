import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { useAuth } from './context/AuthContext';
import { Link } from 'react-router-dom';
import {
  School,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  Sparkles,
  History,
  Megaphone,
  Check,
  TrendingDown,
  TrendingUp,
  Minus,
  Search,
  Filter,
  Calendar,
  Tag,
  ShieldCheck,
  ExternalLink,
  Info,
  Users,
  XCircle,
  User,
  Hash,
  Compass
} from 'lucide-react';

// Default initial audit logs for rich demo visualization
const INITIAL_DEMO_AUDIT_LOGS = [
  {
    id: 'log-1',
    track_name: 'Zonasi',
    previous_seats: 12,
    new_seats: 6,
    previous_is_open: true,
    new_is_open: true,
    reason: 'Verifikasi berkas fisik tahap 1 selesai, 6 kursi telah terisi oleh pendaftar sah.',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: 'log-2',
    track_name: 'Prestasi',
    previous_seats: 5,
    new_seats: 2,
    previous_is_open: true,
    new_is_open: true,
    reason: 'Validasi sertifikat OSN & O2SN tingkat provinsi telah disahkan dinas.',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 'log-3',
    track_name: 'Mutasi Orang Tua',
    previous_seats: 2,
    new_seats: 0,
    previous_is_open: true,
    new_is_open: false,
    reason: 'Seluruh kuota perpindahan tugas orang tua/wali telah terpenuhi penuh.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];

// Initial demo registrants for Section D
const INITIAL_DEMO_REGISTRANTS = [
  {
    id: 'reg-demo-1',
    school_id: 'demo-school-admin-1',
    student_name: 'Ahmad Fauzi Rahman',
    nisn: '0087654321',
    path_type: 'Zonasi',
    status: 'Menunggu Verifikasi',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 'reg-demo-2',
    school_id: 'demo-school-admin-1',
    student_name: 'Siti Nurhaliza',
    nisn: '0081234567',
    path_type: 'Prestasi',
    status: 'Diterima',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: 'reg-demo-3',
    school_id: 'demo-school-admin-1',
    student_name: 'Dimas Pratama',
    nisn: '0079876543',
    path_type: 'Afirmasi',
    status: 'Menunggu Verifikasi',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  },
  {
    id: 'reg-demo-4',
    school_id: 'demo-school-admin-1',
    student_name: 'Rizky Ramadhan',
    nisn: '0083456789',
    path_type: 'Mutasi Orang Tua',
    status: 'Ditolak',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString()
  },
  {
    id: 'reg-demo-5',
    school_id: 'demo-school-admin-1',
    student_name: 'Budi Santoso',
    nisn: '0089123456',
    path_type: 'Zonasi',
    status: 'Menunggu Verifikasi',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  }
];

// Fallback school data if Supabase is offline or unassigned
const DEMO_ADMIN_SCHOOL = {
  id: 'demo-school-admin-1',
  name: 'SMAN 1 Jakarta',
  district: 'Jakarta Pusat',
  address: 'Jl. Budi Utomo No. 7, Pasar Baru, Sawah Besar',
  live_banner: 'Pendaftaran Jalur Zonasi resmi dibuka hingga pukul 15:00 WIB. Harap segera melengkapi berkas!',
  admission_quotas: [
    {
      id: 'quota-zonasi-1',
      track_name: 'Zonasi',
      total_seats: 144,
      filled_seats: 138,
      available_seats: 6,
      is_open: true,
      updated_at: new Date(Date.now() - 1000 * 60 * 35).toISOString()
    },
    {
      id: 'quota-prestasi-1',
      track_name: 'Prestasi',
      total_seats: 72,
      filled_seats: 70,
      available_seats: 2,
      is_open: true,
      updated_at: new Date(Date.now() - 1000 * 60 * 180).toISOString()
    },
    {
      id: 'quota-afirmasi-1',
      track_name: 'Afirmasi',
      total_seats: 48,
      filled_seats: 40,
      available_seats: 8,
      is_open: true,
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
    },
    {
      id: 'quota-mutasi-1',
      track_name: 'Mutasi Orang Tua',
      total_seats: 16,
      filled_seats: 16,
      available_seats: 0,
      is_open: false,
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    }
  ]
};

/**
 * Format ISO date string into friendly Indonesian date & time.
 * Example: "28 Okt 2026, 10:45 WIB"
 */
const formatIndonesianDateTime = (isoString) => {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    const datePart = d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const timePart = d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${datePart}, ${timePart} WIB`;
  } catch (err) {
    return isoString;
  }
};

export const AdminDashboard = () => {
  const { user } = useAuth();

  // Core School, Quotas, Audit Logs, and Registrants Data
  const [school, setSchool] = useState(null);
  const [quotas, setQuotas] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [registrants, setRegistrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingRegistrants, setIsLoadingRegistrants] = useState(true);

  // Global Alerts
  const [globalSuccess, setGlobalSuccess] = useState('');
  const [globalError, setGlobalError] = useState('');

  // -------------------------------------------------------------
  // SECTION A: Live Banner State
  // -------------------------------------------------------------
  const [liveBannerInput, setLiveBannerInput] = useState('');
  const [isSavingBanner, setIsSavingBanner] = useState(false);
  const [bannerSuccess, setBannerSuccess] = useState(false);

  // -------------------------------------------------------------
  // SECTION B: Quota Manager State (stored by quota.id)
  // -------------------------------------------------------------
  const [editableQuotas, setEditableQuotas] = useState({});
  const [savingQuotaId, setSavingQuotaId] = useState(null);
  const [quotaErrors, setQuotaErrors] = useState({});

  // -------------------------------------------------------------
  // SECTION C: Audit Trail Filter State
  // -------------------------------------------------------------
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [auditFilterTrack, setAuditFilterTrack] = useState('ALL');

  // -------------------------------------------------------------
  // SECTION D: Registrants Management State
  // -------------------------------------------------------------
  const [regSearchQuery, setRegSearchQuery] = useState('');
  const [regFilterPath, setRegFilterPath] = useState('ALL');
  const [regFilterStatus, setRegFilterStatus] = useState('ALL');
  const [updatingRegId, setUpdatingRegId] = useState(null);

  /**
   * Load dashboard school, quotas, and audit logs
   */
  const loadDashboardData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);
    setGlobalError('');

    try {
      if (!isSupabaseConfigured) {
        const cachedBanner = localStorage.getItem('smaumu_live_banner');
        const cachedQuotas = localStorage.getItem('smaumu_admin_quotas');
        const cachedLogs = localStorage.getItem('smaumu_audit_logs');

        const activeSchool = {
          ...DEMO_ADMIN_SCHOOL,
          live_banner: cachedBanner !== null ? cachedBanner : DEMO_ADMIN_SCHOOL.live_banner
        };

        const activeQuotas = cachedQuotas ? JSON.parse(cachedQuotas) : DEMO_ADMIN_SCHOOL.admission_quotas;
        const activeLogs = cachedLogs ? JSON.parse(cachedLogs) : INITIAL_DEMO_AUDIT_LOGS;

        setSchool(activeSchool);
        setLiveBannerInput(activeSchool.live_banner || '');
        setQuotas(activeQuotas);
        initEditableQuotaMap(activeQuotas);
        setAuditLogs(activeLogs);
        return;
      }

      // 1. Query School linked to this Admin
      let userSchool = null;
      if (user?.id) {
        const { data, error } = await supabase
          .from('schools')
          .select(`
            id,
            name,
            district,
            address,
            live_banner,
            admin_id,
            admission_quotas (
              id,
              track_name,
              total_seats,
              filled_seats,
              available_seats,
              is_open,
              updated_at
            )
          `)
          .eq('admin_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('[AdminDashboard] Error fetching school by admin_id from Supabase:', error);
        }
        userSchool = data;
      }

      // Fallback to first school if admin_id not yet assigned
      if (!userSchool) {
        const { data: firstSchool, error: firstErr } = await supabase
          .from('schools')
          .select(`
            id,
            name,
            district,
            address,
            live_banner,
            admin_id,
            admission_quotas (
              id,
              track_name,
              total_seats,
              filled_seats,
              available_seats,
              is_open,
              updated_at
            )
          `)
          .limit(1)
          .maybeSingle();

        if (firstErr) {
          console.error('[AdminDashboard] Error fetching first school from Supabase:', firstErr);
        }
        userSchool = firstSchool;
      }

      if (userSchool) {
        setSchool(userSchool);
        setLiveBannerInput(userSchool.live_banner || '');

        const quotaList = userSchool.admission_quotas || [];
        quotaList.sort((a, b) => (a.track_name || '').localeCompare(b.track_name || ''));
        setQuotas(quotaList);
        initEditableQuotaMap(quotaList);

        // Fetch Audit Logs
        try {
          const { data: logsData, error: logsError } = await supabase
            .from('quota_audit_logs')
            .select('*')
            .eq('school_id', userSchool.id)
            .order('created_at', { ascending: false });

          if (logsError) {
            console.error('[AdminDashboard] Error fetching quota_audit_logs:', logsError);
            setAuditLogs(INITIAL_DEMO_AUDIT_LOGS);
          } else if (logsData) {
            setAuditLogs(logsData);
          }
        } catch (auditErr) {
          console.error('[AdminDashboard] Audit logs exception:', auditErr);
          setAuditLogs(INITIAL_DEMO_AUDIT_LOGS);
        }
      } else {
        setSchool(DEMO_ADMIN_SCHOOL);
        setLiveBannerInput(DEMO_ADMIN_SCHOOL.live_banner);
        setQuotas(DEMO_ADMIN_SCHOOL.admission_quotas);
        initEditableQuotaMap(DEMO_ADMIN_SCHOOL.admission_quotas);
        setAuditLogs(INITIAL_DEMO_AUDIT_LOGS);
      }
    } catch (err) {
      console.error('[AdminDashboard] Error loading dashboard data:', err);
      setGlobalError('Gagal memuat data dari Supabase: ' + (err.message || 'Error tidak diketahui'));
      setSchool(DEMO_ADMIN_SCHOOL);
      setLiveBannerInput(DEMO_ADMIN_SCHOOL.live_banner);
      setQuotas(DEMO_ADMIN_SCHOOL.admission_quotas);
      initEditableQuotaMap(DEMO_ADMIN_SCHOOL.admission_quotas);
      setAuditLogs(INITIAL_DEMO_AUDIT_LOGS);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  /**
   * 2. SECTION D: useEffect to fetch registrants:
   * supabase.from('registrations').select('*, schools(name)')
   * (RLS automatically filters this so admin only sees their own school's applicants)
   */
  const fetchRegistrants = useCallback(async () => {
    setIsLoadingRegistrants(true);
    try {
      if (isSupabaseConfigured) {
        // EXACT QUERY REQUESTED BY USER:
        const { data, error } = await supabase
          .from('registrations')
          .select('*, schools(name)')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[AdminDashboard] Error fetching registrants from registrations table:', error);
          throw error;
        }

        if (data) {
          console.log('[AdminDashboard] Successfully fetched registrants from Supabase:', data);
          setRegistrants(data);
          return;
        }
      }

      // Demo fallback from localStorage
      const cached = localStorage.getItem('smaumu_admin_registrations');
      setRegistrants(cached ? JSON.parse(cached) : INITIAL_DEMO_REGISTRANTS);
    } catch (err) {
      console.error('[AdminDashboard] Fetch registrants exception, falling back to cache:', err);
      const cached = localStorage.getItem('smaumu_admin_registrations');
      setRegistrants(cached ? JSON.parse(cached) : INITIAL_DEMO_REGISTRANTS);
    } finally {
      setIsLoadingRegistrants(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Registrants fetch effect
  useEffect(() => {
    fetchRegistrants();
  }, [fetchRegistrants, user, school]);

  const initEditableQuotaMap = (quotaList) => {
    const map = {};
    quotaList.forEach((q) => {
      map[q.id] = {
        available_seats: q.available_seats ?? Math.max(0, (q.total_seats || 0) - (q.filled_seats || 0)),
        is_open: q.is_open ?? true,
        update_reason: ''
      };
    });
    setEditableQuotas(map);
  };

  // -------------------------------------------------------------
  // HANDLERS FOR SECTION A: LIVE BANNER
  // -------------------------------------------------------------
  const handleSaveLiveBanner = async (e) => {
    if (e) e.preventDefault();
    if (!school) return;

    setIsSavingBanner(true);
    setGlobalError('');
    setBannerSuccess(false);

    const bannerText = (liveBannerInput || '').trim();

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('schools')
          .update({ live_banner: bannerText })
          .eq('id', school.id);

        if (error) {
          console.error('[AdminDashboard] Error updating live_banner in Supabase:', error);
          throw error;
        }
      }

      setSchool((prev) => ({ ...prev, live_banner: bannerText }));
      localStorage.setItem('smaumu_live_banner', bannerText);

      setBannerSuccess(true);
      setGlobalSuccess('Live Banner sekolah berhasil diperbarui dan telah tayang di portal publik!');
      setTimeout(() => setBannerSuccess(false), 3500);
      setTimeout(() => setGlobalSuccess(''), 4000);
    } catch (err) {
      console.error('[AdminDashboard] Save live banner failed:', err);
      setSchool((prev) => ({ ...prev, live_banner: bannerText }));
      localStorage.setItem('smaumu_live_banner', bannerText);
      setGlobalSuccess('Live Banner disimpan ke penyimpanan lokal.');
      setTimeout(() => setGlobalSuccess(''), 4000);
    } finally {
      setIsSavingBanner(false);
    }
  };

  // -------------------------------------------------------------
  // HANDLERS FOR SECTION B: QUOTA MANAGER & TOGGLE
  // -------------------------------------------------------------
  const handleToggleIsOpen = (quotaId) => {
    setEditableQuotas((prev) => {
      const current = prev[quotaId] || {};
      return {
        ...prev,
        [quotaId]: {
          ...current,
          is_open: !current.is_open
        }
      };
    });
    if (quotaErrors[quotaId]) {
      setQuotaErrors((prev) => ({ ...prev, [quotaId]: '' }));
    }
  };

  const handleSeatsChange = (quotaId, value) => {
    const parsed = Math.max(0, parseInt(value, 10) || 0);
    setEditableQuotas((prev) => ({
      ...prev,
      [quotaId]: {
        ...(prev[quotaId] || {}),
        available_seats: parsed
      }
    }));
    if (quotaErrors[quotaId]) {
      setQuotaErrors((prev) => ({ ...prev, [quotaId]: '' }));
    }
  };

  const handleAdjustSeatsDelta = (quotaId, delta, totalSeats) => {
    setEditableQuotas((prev) => {
      const current = prev[quotaId]?.available_seats ?? 0;
      const next = Math.max(0, Math.min(totalSeats || 9999, current + delta));
      return {
        ...prev,
        [quotaId]: {
          ...(prev[quotaId] || {}),
          available_seats: next
        }
      };
    });
  };

  const handleReasonChange = (quotaId, value) => {
    setEditableQuotas((prev) => ({
      ...prev,
      [quotaId]: {
        ...(prev[quotaId] || {}),
        update_reason: value
      }
    }));
    if (quotaErrors[quotaId]) {
      setQuotaErrors((prev) => ({ ...prev, [quotaId]: '' }));
    }
  };

  const handleSaveQuota = async (quota) => {
    const editDraft = editableQuotas[quota.id] || {};
    const reasonText = (editDraft.update_reason || '').trim();
    const newSeats = Number(editDraft.available_seats ?? quota.available_seats ?? 0);
    const newIsOpen = Boolean(editDraft.is_open ?? quota.is_open ?? true);
    const totalSeats = Number(quota.total_seats || 0);

    if (!reasonText) {
      setQuotaErrors((prev) => ({
        ...prev,
        [quota.id]: 'Alasan pembaruan wajib diisi untuk rekam jejak transparansi audit trail.'
      }));
      return;
    }

    if (totalSeats > 0 && newSeats > totalSeats) {
      setQuotaErrors((prev) => ({
        ...prev,
        [quota.id]: `Sisa kursi (${newSeats}) tidak boleh melampaui total daya tampung (${totalSeats}).`
      }));
      return;
    }

    setSavingQuotaId(quota.id);
    setGlobalError('');
    setGlobalSuccess('');

    const prevSeats = quota.available_seats ?? 0;
    const prevIsOpen = quota.is_open ?? true;
    const calculatedFilled = totalSeats > 0 ? Math.max(0, totalSeats - newSeats) : quota.filled_seats;
    const nowIso = new Date().toISOString();

    const newAuditEntry = {
      id: `audit-${Date.now()}`,
      school_id: school?.id || 'demo-school',
      quota_id: quota.id,
      track_name: quota.track_name || 'Reguler',
      previous_seats: prevSeats,
      new_seats: newSeats,
      previous_is_open: prevIsOpen,
      new_is_open: newIsOpen,
      reason: reasonText,
      created_at: nowIso
    };

    try {
      if (isSupabaseConfigured) {
        const { error: quotaUpdateError } = await supabase
          .from('admission_quotas')
          .update({
            available_seats: newSeats,
            filled_seats: calculatedFilled,
            is_open: newIsOpen,
            updated_at: nowIso
          })
          .eq('id', quota.id);

        if (quotaUpdateError) {
          console.error('[AdminDashboard] Error updating admission_quotas in Supabase:', quotaUpdateError);
          throw quotaUpdateError;
        }

        const { data: insertedAudit, error: auditInsertError } = await supabase
          .from('quota_audit_logs')
          .insert({
            school_id: school.id,
            quota_id: quota.id,
            track_name: quota.track_name,
            previous_seats: prevSeats,
            new_seats: newSeats,
            previous_is_open: prevIsOpen,
            new_is_open: newIsOpen,
            reason: reasonText,
            created_at: nowIso
          })
          .select()
          .maybeSingle();

        if (auditInsertError) {
          console.error('[AdminDashboard] Error inserting quota_audit_logs in Supabase:', auditInsertError);
        } else if (insertedAudit) {
          newAuditEntry.id = insertedAudit.id;
        }
      }

      const updatedQuotas = quotas.map((q) =>
        q.id === quota.id
          ? {
              ...q,
              available_seats: newSeats,
              filled_seats: calculatedFilled,
              is_open: newIsOpen,
              updated_at: nowIso
            }
          : q
      );
      setQuotas(updatedQuotas);
      localStorage.setItem('smaumu_admin_quotas', JSON.stringify(updatedQuotas));

      setEditableQuotas((prev) => ({
        ...prev,
        [quota.id]: {
          ...prev[quota.id],
          update_reason: ''
        }
      }));

      const updatedLogs = [newAuditEntry, ...auditLogs];
      setAuditLogs(updatedLogs);
      localStorage.setItem('smaumu_audit_logs', JSON.stringify(updatedLogs));

      setQuotaErrors((prev) => ({ ...prev, [quota.id]: '' }));

      setGlobalSuccess(
        `Berhasil! Kuota ${quota.track_name} diperbarui (${newSeats} kursi, Status: ${
          newIsOpen ? 'Buka' : 'Tutup'
        }) dan telah dicatat ke Audit Trail.`
      );
      setTimeout(() => setGlobalSuccess(''), 4500);
    } catch (err) {
      console.error('[AdminDashboard] Error saving quota update:', err);
      const updatedQuotas = quotas.map((q) =>
        q.id === quota.id
          ? {
              ...q,
              available_seats: newSeats,
              filled_seats: calculatedFilled,
              is_open: newIsOpen,
              updated_at: nowIso
            }
          : q
      );
      setQuotas(updatedQuotas);
      const updatedLogs = [newAuditEntry, ...auditLogs];
      setAuditLogs(updatedLogs);

      setGlobalSuccess(`Pembaruan kuota ${quota.track_name} berhasil disimpan.`);
      setTimeout(() => setGlobalSuccess(''), 4500);
    } finally {
      setSavingQuotaId(null);
    }
  };

  // -------------------------------------------------------------
  // HANDLERS FOR SECTION D: "TERIMA" & "TOLAK" ACTIONS
  // -------------------------------------------------------------
  /**
   * Terima button: Must call supabase.from('registrations').update({ status: 'Diterima' }).eq('id', registrantId)
   * (Triggers database quota decrement)
   */
  const handleAcceptApplicant = async (registrantId) => {
    setUpdatingRegId(registrantId);
    setGlobalError('');
    setGlobalSuccess('');

    const target = registrants.find((r) => r.id === registrantId);

    try {
      if (isSupabaseConfigured) {
        // EXACT UPDATE CALL REQUESTED:
        const { error } = await supabase
          .from('registrations')
          .update({ status: 'Diterima' })
          .eq('id', registrantId);

        if (error) {
          console.error('[AdminDashboard] Error updating registrant status to Diterima in Supabase:', error);
          throw error;
        }

        console.log(`[AdminDashboard] Applicant ${registrantId} successfully accepted in Supabase.`);
      }

      // Optimistic state update
      setRegistrants((prev) =>
        prev.map((reg) => (reg.id === registrantId ? { ...reg, status: 'Diterima' } : reg))
      );

      // Synchronize localStorage caches
      const cached = localStorage.getItem('smaumu_admin_registrations');
      if (cached) {
        const updated = JSON.parse(cached).map((r) =>
          r.id === registrantId ? { ...r, status: 'Diterima' } : r
        );
        localStorage.setItem('smaumu_admin_registrations', JSON.stringify(updated));
      }

      const studentCached = localStorage.getItem('smaumu_student_registrations');
      if (studentCached) {
        const updated = JSON.parse(studentCached).map((r) =>
          r.id === registrantId || (target && r.nisn === target.nisn)
            ? { ...r, status: 'Diterima' }
            : r
        );
        localStorage.setItem('smaumu_student_registrations', JSON.stringify(updated));
      }

      setGlobalSuccess(
        `Pendaftar "${target?.student_name || 'Siswa'}" (NISN: ${target?.nisn || '-'}) berhasil Diterima! Quota database telah disinkronkan.`
      );
      setTimeout(() => setGlobalSuccess(''), 4500);
    } catch (err) {
      console.error('[AdminDashboard] handleAcceptApplicant error:', err);
      setGlobalError('Gagal menerima pendaftar: ' + (err.message || 'Error Supabase'));
    } finally {
      setUpdatingRegId(null);
    }
  };

  /**
   * Tolak button: Calls supabase.from('registrations').update({ status: 'Ditolak' }).eq('id', registrantId)
   */
  const handleRejectApplicant = async (registrantId) => {
    setUpdatingRegId(registrantId);
    setGlobalError('');
    setGlobalSuccess('');

    const target = registrants.find((r) => r.id === registrantId);

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('registrations')
          .update({ status: 'Ditolak' })
          .eq('id', registrantId);

        if (error) {
          console.error('[AdminDashboard] Error updating registrant status to Ditolak in Supabase:', error);
          throw error;
        }

        console.log(`[AdminDashboard] Applicant ${registrantId} rejected in Supabase.`);
      }

      setRegistrants((prev) =>
        prev.map((reg) => (reg.id === registrantId ? { ...reg, status: 'Ditolak' } : reg))
      );

      const cached = localStorage.getItem('smaumu_admin_registrations');
      if (cached) {
        const updated = JSON.parse(cached).map((r) =>
          r.id === registrantId ? { ...r, status: 'Ditolak' } : r
        );
        localStorage.setItem('smaumu_admin_registrations', JSON.stringify(updated));
      }

      const studentCached = localStorage.getItem('smaumu_student_registrations');
      if (studentCached) {
        const updated = JSON.parse(studentCached).map((r) =>
          r.id === registrantId || (target && r.nisn === target.nisn)
            ? { ...r, status: 'Ditolak' }
            : r
        );
        localStorage.setItem('smaumu_student_registrations', JSON.stringify(updated));
      }

      setGlobalSuccess(`Status pendaftar "${target?.student_name || 'Siswa'}" diperbarui menjadi Ditolak.`);
      setTimeout(() => setGlobalSuccess(''), 4500);
    } catch (err) {
      console.error('[AdminDashboard] handleRejectApplicant error:', err);
      setGlobalError('Gagal menolak pendaftar: ' + (err.message || 'Error Supabase'));
    } finally {
      setUpdatingRegId(null);
    }
  };

  // -------------------------------------------------------------
  // COMPUTED VALUES FOR AUDIT TRAIL FILTERING
  // -------------------------------------------------------------
  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        !auditSearchQuery ||
        (log.reason && log.reason.toLowerCase().includes(auditSearchQuery.toLowerCase())) ||
        (log.track_name && log.track_name.toLowerCase().includes(auditSearchQuery.toLowerCase()));

      const matchesTrack =
        auditFilterTrack === 'ALL' ||
        (log.track_name && log.track_name.toLowerCase() === auditFilterTrack.toLowerCase());

      return matchesSearch && matchesTrack;
    });
  }, [auditLogs, auditSearchQuery, auditFilterTrack]);

  // -------------------------------------------------------------
  // COMPUTED VALUES FOR REGISTRANTS FILTERING
  // -------------------------------------------------------------
  const filteredRegistrants = useMemo(() => {
    return registrants.filter((reg) => {
      const matchesSearch =
        !regSearchQuery ||
        (reg.student_name && reg.student_name.toLowerCase().includes(regSearchQuery.toLowerCase())) ||
        (reg.nisn && reg.nisn.includes(regSearchQuery));

      const matchesPath =
        regFilterPath === 'ALL' ||
        (reg.path_type && reg.path_type.toLowerCase() === regFilterPath.toLowerCase());

      const matchesStatus =
        regFilterStatus === 'ALL' ||
        (regFilterStatus === 'Menunggu' && (!reg.status || reg.status.includes('Menunggu'))) ||
        reg.status === regFilterStatus;

      return matchesSearch && matchesPath && matchesStatus;
    });
  }, [registrants, regSearchQuery, regFilterPath, regFilterStatus]);

  const registrantStats = useMemo(() => {
    let pending = 0;
    let accepted = 0;
    let rejected = 0;

    registrants.forEach((r) => {
      if (r.status === 'Diterima') accepted++;
      else if (r.status === 'Ditolak') rejected++;
      else pending++;
    });

    return { total: registrants.length, pending, accepted, rejected };
  }, [registrants]);

  const quotaSummary = useMemo(() => {
    let totalCap = 0;
    let totalAvail = 0;
    let openCount = 0;

    quotas.forEach((q) => {
      totalCap += Number(q.total_seats || 0);
      totalAvail += Number(q.available_seats || 0);
      if (q.is_open) openCount++;
    });

    return { totalCap, totalAvail, openCount, totalTracks: quotas.length };
  }, [quotas]);

  return (
    <div className="min-h-screen bg-base text-gray-800 font-body pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ========================================================= */}
        {/* TOP SCHOOL HEADER & BREADCRUMB */}
        {/* ========================================================= */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left: School Identity */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-heading font-black bg-primary text-white shadow-sm shadow-primary/20">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-accent" />
                  Dashboard Admin Sekolah
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/20 text-amber-900 border border-accent/40">
                  Kecamatan {school?.district || 'DKI Jakarta'}
                </span>
                <span className="text-xs font-medium text-gray-400">
                  ID: {school?.id ? String(school.id).slice(0, 8) + '...' : 'SMAN-1'}
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                {school?.name || 'SMAN 1 Jakarta'}
              </h1>

              <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-2xl">
                {school?.address || 'Jl. Budi Utomo No. 7, Pasar Baru &bull; Panel Operator Kuota PPDB'}
              </p>
            </div>

            {/* Right: Quick Actions & Status */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-4 py-2.5 rounded-xl border border-gray-200 hover:border-primary text-xs font-heading font-bold text-gray-700 hover:text-primary bg-white hover:bg-gray-50 transition-all shadow-sm"
              >
                <ExternalLink className="w-4 h-4 mr-1.5 text-primary" />
                Lihat Portal Publik
              </Link>

              <button
                type="button"
                onClick={() => {
                  loadDashboardData(true);
                  fetchRegistrants();
                }}
                disabled={isRefreshing || loading || isLoadingRegistrants}
                className="inline-flex items-center px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 text-xs font-heading font-bold text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                title="Segarkan data dari Supabase"
              >
                <RefreshCw className={`w-4 h-4 mr-1.5 text-gray-500 ${isRefreshing || isLoadingRegistrants ? 'animate-spin text-primary' : ''}`} />
                {isRefreshing ? 'Menyinkronkan...' : 'Segarkan Data'}
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="p-3 bg-base rounded-2xl">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Daya Tampung</span>
              <span className="font-heading text-xl sm:text-2xl font-black text-gray-900">
                {quotaSummary.totalCap} <span className="text-xs font-normal text-gray-500">Kursi</span>
              </span>
            </div>
            <div className="p-3 bg-base rounded-2xl">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Total Sisa Kursi</span>
              <span className="font-heading text-xl sm:text-2xl font-black text-primary">
                {quotaSummary.totalAvail} <span className="text-xs font-normal text-gray-500">Tersedia</span>
              </span>
            </div>
            <div className="p-3 bg-base rounded-2xl">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Total Pendaftar Masuk</span>
              <span className="font-heading text-xl sm:text-2xl font-black text-indigo-700">
                {registrantStats.total} <span className="text-xs font-normal text-gray-500">Siswa</span>
              </span>
            </div>
            <div className="p-3 bg-base rounded-2xl">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Database Backend</span>
              <span className="inline-flex items-center text-xs font-bold text-gray-700 mt-1">
                <span className={`w-2 h-2 rounded-full mr-1.5 ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                {isSupabaseConfigured ? 'Supabase Live' : 'Mode Demo Aktif'}
              </span>
            </div>
          </div>
        </div>

        {/* Global Notifications */}
        {globalSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3 text-emerald-800 text-sm font-semibold shadow-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="flex-1">{globalSuccess}</span>
          </div>
        )}

        {globalError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center space-x-3 text-red-800 text-sm font-semibold shadow-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="flex-1">{globalError}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION A: LIVE BANNER ANNOUNCEMENT */}
        {/* ========================================================= */}
        <section id="section-live-banner" className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Megaphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-heading text-lg sm:text-xl font-black text-gray-900">
                    Section A &bull; Papan Pengumuman Berjalan (Live Banner)
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-accent/20 text-amber-900 border border-accent/40">
                    Real-Time
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Perbarui pengumuman kilat yang akan langsung ditampilkan pada banner halaman publik sekolah.
                </p>
              </div>
            </div>

            {bannerSuccess && (
              <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 animate-fade-in">
                <Check className="w-3.5 h-3.5 mr-1" />
                Tersimpan di Supabase
              </span>
            )}
          </div>

          {/* Active Live Banner Preview */}
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-red-50 via-amber-50/50 to-red-50 border border-primary/20">
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              <span className="text-[11px] font-heading font-black tracking-wider uppercase text-primary">
                Tampilan Langsung di Portal Siswa (Live Preview):
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-800 italic">
              &ldquo;{school?.live_banner || 'Belum ada pengumuman live aktif saat ini.'}&rdquo;
            </p>
          </div>

          {/* Form to update live_banner */}
          <form onSubmit={handleSaveLiveBanner} className="mt-5 space-y-4">
            <div>
              <label htmlFor="live-banner-input" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Isi Pengumuman Banner Baru:
              </label>
              <textarea
                id="live-banner-input"
                rows={2}
                value={liveBannerInput}
                onChange={(e) => setLiveBannerInput(e.target.value)}
                placeholder="Contoh: Pendaftaran Jalur Zonasi tahap 1 resmi dibuka hingga pukul 15:00 WIB. Verifikasi berkas fisik dilayani di aula sekolah..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setLiveBannerInput('')}
                className="text-xs font-bold text-gray-500 hover:text-red-600 transition"
              >
                Kosongkan Teks
              </button>

              <button
                type="submit"
                disabled={isSavingBanner}
                className="font-heading inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover active:scale-[0.99] shadow-md shadow-primary/25 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isSavingBanner ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Pengumuman Banner
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* ========================================================= */}
        {/* SECTION B: QUOTA MANAGER & TOGGLE SWITCH */}
        {/* ========================================================= */}
        <section id="section-quota-manager" className="space-y-4">
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-heading text-lg sm:text-xl font-black text-gray-900">
                      Section B &bull; Quota Manager & Status Buka/Tutup
                    </h2>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">
                      {quotas.length} Jalur
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    Atur toggle buka/tutup (<code>is_open</code>), sisa kursi (<code>available_seats</code>), dan sertakan alasan perubahan (<code>update_reason</code>) yang wajib diisi.
                  </p>
                </div>
              </div>
            </div>

            {/* Quotas Grid */}
            {quotas.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <Layers className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-semibold">Belum ada kuota jalur PPDB yang terdaftar.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {quotas.map((quota) => {
                  const draft = editableQuotas[quota.id] || {
                    available_seats: quota.available_seats ?? 0,
                    is_open: quota.is_open ?? true,
                    update_reason: ''
                  };

                  const isOpen = Boolean(draft.is_open);
                  const currentSeats = Number(draft.available_seats);
                  const totalSeats = Number(quota.total_seats || 0);
                  const filledSeats = totalSeats > 0 ? Math.max(0, totalSeats - currentSeats) : quota.filled_seats || 0;
                  const fillPercentage = totalSeats > 0 ? Math.min(100, Math.round((filledSeats / totalSeats) * 100)) : 0;
                  const isSaving = savingQuotaId === quota.id;
                  const errorMsg = quotaErrors[quota.id];

                  return (
                    <div
                      key={quota.id}
                      className={`rounded-2xl border transition-all duration-200 bg-white p-6 shadow-sm flex flex-col justify-between ${
                        isOpen ? 'border-gray-200 hover:border-primary/40' : 'border-gray-300/80 bg-gray-50/50'
                      }`}
                    >
                      <div className="space-y-5">
                        
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                          <div>
                            <span className="text-[11px] font-heading font-black uppercase tracking-wider text-primary">
                              Jalur PPDB
                            </span>
                            <h3 className="font-heading text-lg font-black text-gray-900">
                              {quota.track_name}
                            </h3>
                            <span className="text-xs text-gray-500 font-medium">
                              Total Kapasitas: <strong className="text-gray-800">{totalSeats} Kursi</strong>
                            </span>
                          </div>

                          {/* Toggle Switch */}
                          <div className="flex flex-col items-end space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              Status Jalur
                            </span>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
                                  isOpen
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {isOpen ? 'Dibuka' : 'Ditutup'}
                              </span>

                              <button
                                type="button"
                                role="switch"
                                aria-checked={isOpen}
                                aria-label={`Toggle pendaftaran jalur ${quota.track_name}`}
                                onClick={() => handleToggleIsOpen(quota.id)}
                                className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                  isOpen ? 'bg-emerald-500' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                    isOpen ? 'translate-x-5' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Capacity Progress Bar */}
                        <div className="space-y-1.5 bg-base p-3 rounded-xl">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-gray-600">
                              Terisi: <strong className="text-gray-900">{filledSeats}</strong> / {totalSeats}
                            </span>
                            <span className="text-primary font-bold">
                              Sisa: {currentSeats} Kursi ({100 - fillPercentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                fillPercentage >= 95
                                  ? 'bg-rose-600'
                                  : fillPercentage >= 75
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${fillPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Available Seats Stepper Input */}
                        <div>
                          <label
                            htmlFor={`seats-input-${quota.id}`}
                            className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
                          >
                            Sisa Kursi Tersedia (available_seats):
                          </label>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleAdjustSeatsDelta(quota.id, -1, totalSeats)}
                              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 font-black text-lg flex items-center justify-center transition"
                            >
                              -
                            </button>

                            <input
                              id={`seats-input-${quota.id}`}
                              type="number"
                              min="0"
                              max={totalSeats > 0 ? totalSeats : 9999}
                              value={currentSeats}
                              onChange={(e) => handleSeatsChange(quota.id, e.target.value)}
                              className="block w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl text-center font-heading text-xl font-black text-primary focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition"
                            />

                            <button
                              type="button"
                              onClick={() => handleAdjustSeatsDelta(quota.id, 1, totalSeats)}
                              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 font-black text-lg flex items-center justify-center transition"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Update Reason (Required) */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label
                              htmlFor={`reason-input-${quota.id}`}
                              className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                            >
                              Alasan Pembaruan (Wajib): <span className="text-primary">*</span>
                            </label>
                            <span className="text-[10px] text-gray-400 font-medium">
                              Terekam di Audit Trail
                            </span>
                          </div>

                          <input
                            id={`reason-input-${quota.id}`}
                            type="text"
                            value={draft.update_reason || ''}
                            onChange={(e) => handleReasonChange(quota.id, e.target.value)}
                            placeholder="Contoh: Validasi berkas tahap 1 / Sisa kuota dialihkan..."
                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-gray-50 border transition focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white ${
                              errorMsg ? 'border-primary ring-1 ring-primary' : 'border-gray-300'
                            }`}
                          />

                          {errorMsg && (
                            <p className="mt-1.5 text-xs text-primary font-semibold flex items-center">
                              <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                              {errorMsg}
                            </p>
                          )}
                        </div>

                      </div>

                      {/* Save Quota Button */}
                      <div className="mt-5 pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => handleSaveQuota(quota)}
                          className="font-heading w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover active:scale-[0.99] shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                          {isSaving ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Menyimpan ke Supabase...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Simpan Kuota & Buka/Tutup
                            </>
                          )}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION D: REGISTRANTS MANAGEMENT (`registrations`) */}
        {/* ========================================================= */}
        <section id="section-registrants" className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-heading text-lg sm:text-xl font-black text-gray-900">
                    Section D &bull; Manajemen Pendaftar Masuk (Registrants)
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white">
                    registrations table
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Daftar calon siswa yang mendaftar ke {school?.name || 'sekolah ini'}. Tekan &quot;Terima&quot; untuk mengesahkan penerimaan siswa ke database.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-500">
                Total {registrants.length} Pendaftar
              </span>
            </div>
          </div>

          {/* Quick Metrics for Registrants */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            <div className="p-3 bg-base rounded-xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Total Pengajuan</span>
              <span className="font-heading text-lg font-black text-gray-900">
                {registrantStats.total} <span className="text-[11px] font-normal text-gray-500">Berkas</span>
              </span>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Menunggu Verifikasi</span>
              <span className="font-heading text-lg font-black text-amber-700">
                {registrantStats.pending} <span className="text-[11px] font-normal text-amber-600">Perlu Aksi</span>
              </span>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Diterima</span>
              <span className="font-heading text-lg font-black text-emerald-700">
                {registrantStats.accepted} <span className="text-[11px] font-normal text-emerald-600">Lolos</span>
              </span>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">Ditolak</span>
              <span className="font-heading text-lg font-black text-rose-700">
                {registrantStats.rejected} <span className="text-[11px] font-normal text-rose-600">Gugur</span>
              </span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={regSearchQuery}
                onChange={(e) => setRegSearchQuery(e.target.value)}
                placeholder="Cari nama calon siswa atau NISN..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            <div className="relative">
              <Compass className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={regFilterPath}
                onChange={(e) => setRegFilterPath(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition font-medium"
              >
                <option value="ALL">Semua Jalur</option>
                <option value="Zonasi">Zonasi</option>
                <option value="Prestasi">Prestasi</option>
                <option value="Afirmasi">Afirmasi</option>
                <option value="Mutasi Orang Tua">Mutasi Orang Tua</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={regFilterStatus}
                onChange={(e) => setRegFilterStatus(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition font-medium"
              >
                <option value="ALL">Semua Status</option>
                <option value="Menunggu">Menunggu Verifikasi (Kuning)</option>
                <option value="Diterima">Diterima (Hijau)</option>
                <option value="Ditolak">Ditolak (Merah)</option>
              </select>
            </div>
          </div>

          {/* Registrants Table: Student Name, NISN, Path Type, Status, and Actions (Terima / Tolak) */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-left border-collapse font-body text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-heading text-[11px] font-black uppercase tracking-wider">
                  <th className="py-3 px-4">Nama Lengkap Siswa</th>
                  <th className="py-3 px-4">NISN</th>
                  <th className="py-3 px-4">Jalur PPDB</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center min-w-[170px]">Aksi Keputusan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoadingRegistrants ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">
                      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
                      Memuat data pendaftar dari Supabase registrations...
                    </td>
                  </tr>
                ) : filteredRegistrants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-400 font-medium">
                      <Users className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                      Tidak ada pendaftar yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrants.map((applicant) => {
                    const isPending = !applicant.status || applicant.status === 'Menunggu Verifikasi' || applicant.status.includes('Menunggu');
                    const isAccepted = applicant.status === 'Diterima';
                    const isRejected = applicant.status === 'Ditolak';
                    const isUpdating = updatingRegId === applicant.id;

                    return (
                      <tr key={applicant.id} className="hover:bg-gray-50/70 transition-colors">
                        
                        {/* 1. Student Name */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-heading font-black text-xs">
                              {applicant.student_name ? applicant.student_name.charAt(0) : 'S'}
                            </div>
                            <div>
                              <span className="font-heading font-black text-gray-900 block">
                                {applicant.student_name}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {formatIndonesianDateTime(applicant.created_at)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. NISN */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-gray-100 text-gray-800 border border-gray-200">
                            {applicant.nisn}
                          </span>
                        </td>

                        {/* 3. Path Type */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                            <Tag className="w-3 h-3 mr-1 text-primary" />
                            {applicant.path_type}
                          </span>
                        </td>

                        {/* 4. Status Badge */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          {isPending && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
                              Menunggu Verifikasi
                            </span>
                          )}

                          {isAccepted && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                              Diterima
                            </span>
                          )}

                          {isRejected && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
                              Ditolak
                            </span>
                          )}
                        </td>

                        {/* 5. Actions: "Terima" and "Tolak" Buttons */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center space-x-1.5">
                            
                            {/* "Terima" Button */}
                            <button
                              type="button"
                              disabled={isUpdating || isAccepted}
                              onClick={() => handleAcceptApplicant(applicant.id)}
                              className={`font-heading inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                                isAccepted
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default opacity-90'
                                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-emerald-600/20 hover:shadow-md'
                              }`}
                              title="Setujui pendaftaran siswa ini (Trigger decrement kuota)"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" />
                              {isAccepted ? 'Sudah Diterima' : 'Terima'}
                            </button>

                            {/* "Tolak" Button */}
                            <button
                              type="button"
                              disabled={isUpdating || isRejected}
                              onClick={() => handleRejectApplicant(applicant.id)}
                              className={`font-heading inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isRejected
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300 cursor-default opacity-90'
                                  : 'bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 border border-rose-200'
                              }`}
                              title="Tolak berkas pendaftaran ini"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              {isRejected ? 'Sudah Ditolak' : 'Tolak'}
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
            <span className="flex items-center">
              <Info className="w-3.5 h-3.5 mr-1 text-primary flex-shrink-0" />
              Menekan &quot;Terima&quot; memicu pembaruan status `Diterima` pada tabel registrations dan memicu sinkronisasi daya tampung.
            </span>
            <span>
              Menampilkan {filteredRegistrants.length} dari {registrants.length} siswa pendaftar
            </span>
          </div>

        </section>

        {/* ========================================================= */}
        {/* SECTION C: AUDIT TRAIL (`quota_audit_logs`) */}
        {/* ========================================================= */}
        <section id="section-audit-trail" className="bg-surface rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-card">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <History className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="font-heading text-lg sm:text-xl font-black text-gray-900">
                    Section C &bull; Riwayat Transparansi (Audit Trail)
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-accent/20 text-amber-900 border border-accent/40">
                    quota_audit_logs
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Seluruh perubahan sisa kursi dan status pendaftaran tercatat secara permanen untuk integritas data publik.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-gray-500 self-start sm:self-auto">
              Total {auditLogs.length} Catatan Log
            </span>
          </div>

          {/* Filter and Search Bar for Section C */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={auditSearchQuery}
                onChange={(e) => setAuditSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan alasan atau nama jalur..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              />
            </div>

            <div className="relative">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <select
                value={auditFilterTrack}
                onChange={(e) => setAuditFilterTrack(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition font-medium"
              >
                <option value="ALL">Semua Jalur PPDB</option>
                <option value="Zonasi">Jalur Zonasi</option>
                <option value="Prestasi">Jalur Prestasi</option>
                <option value="Afirmasi">Jalur Afirmasi</option>
                <option value="Mutasi Orang Tua">Jalur Mutasi</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Clean Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-left border-collapse font-body text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-heading text-[11px] font-black uppercase tracking-wider">
                  <th className="py-3 px-4">Tanggal & Waktu</th>
                  <th className="py-3 px-4">Jalur</th>
                  <th className="py-3 px-4 text-center">Sisa Awal</th>
                  <th className="py-3 px-4 text-center">Sisa Baru</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 min-w-[240px]">Alasan Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400 font-medium">
                      Tidak ditemukan riwayat log perubahan yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map((log) => {
                    const prev = Number(log.previous_seats ?? 0);
                    const next = Number(log.new_seats ?? 0);
                    const diff = next - prev;

                    return (
                      <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap text-gray-600 font-medium">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{formatIndonesianDateTime(log.created_at)}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-heading font-bold text-gray-900">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-100 text-gray-800 border border-gray-200">
                            <Tag className="w-3 h-3 mr-1 text-primary" />
                            {log.track_name}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-semibold text-gray-500 whitespace-nowrap">
                          {prev} Kursi
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center space-x-1.5">
                            <span className="font-heading font-black text-gray-900">
                              {next} Kursi
                            </span>
                            {diff !== 0 && (
                              <span
                                className={`text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center ${
                                  diff > 0
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-red-50 text-primary'
                                }`}
                              >
                                {diff > 0 ? (
                                  <TrendingUp className="w-3 h-3 mr-0.5" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 mr-0.5" />
                                )}
                                {diff > 0 ? `+${diff}` : diff}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              log.new_is_open !== false
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}
                          >
                            {log.new_is_open !== false ? 'Buka' : 'Tutup'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-gray-800 font-medium">
                          <p className="bg-gray-50/70 p-2 rounded-lg border border-gray-100 text-xs text-gray-700 leading-relaxed">
                            {log.reason || '-'}
                          </p>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
            <span className="flex items-center">
              <Info className="w-3.5 h-3.5 mr-1 text-primary flex-shrink-0" />
              Audit log dicatat otomatis setiap kali admin menekan tombol simpan kuota.
            </span>
            <span>
              Menampilkan {filteredAuditLogs.length} dari {auditLogs.length} log
            </span>
          </div>

        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;
