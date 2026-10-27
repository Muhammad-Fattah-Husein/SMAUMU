import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { useAuth } from './context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  School,
  Save,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [school, setSchool] = useState(null);
  const [quotas, setQuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Editable quota state stored by quota ID
  const [editableSeats, setEditableSeats] = useState({});

  // Fetch school linked to logged-in admin user
  const fetchAdminSchool = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      if (!isSupabaseConfigured) {
        // Mock fallback for demo mode
        const demoSchool = {
          id: 'demo-school-1',
          name: 'SMAN 1 Jakarta (Mode Demo)',
          district: 'Jakarta Pusat',
          address: 'Jl. Budi Utomo No. 7, Pasar Baru',
          admin_id: user?.id,
          admission_quotas: [
            { id: 'q-demo-1', track_name: 'Zonasi', total_seats: 144, filled_seats: 138, available_seats: 6, updated_at: new Date().toISOString() },
            { id: 'q-demo-2', track_name: 'Prestasi', total_seats: 72, filled_seats: 70, available_seats: 2, updated_at: new Date().toISOString() },
            { id: 'q-demo-3', track_name: 'Afirmasi', total_seats: 48, filled_seats: 40, available_seats: 8, updated_at: new Date().toISOString() }
          ]
        };
        setSchool(demoSchool);
        setQuotas(demoSchool.admission_quotas);
        initializeEditableSeats(demoSchool.admission_quotas);
        setLoading(false);
        return;
      }

      // 1. Query the school assigned to this admin user ID
      const { data: userSchool, error: schoolError } = await supabase
        .from('schools')
        .select(`
          id,
          name,
          district,
          address,
          admin_id,
          admission_quotas (
            id,
            track_name,
            total_seats,
            filled_seats,
            available_seats,
            updated_at
          )
        `)
        .eq('admin_id', user.id)
        .maybeSingle();

      if (schoolError) {
        throw schoolError;
      }

      if (userSchool) {
        setSchool(userSchool);
        const sortedQuotas = (userSchool.admission_quotas || []).sort((a, b) => 
          (a.track_name || '').localeCompare(b.track_name || '')
        );
        setQuotas(sortedQuotas);
        initializeEditableSeats(sortedQuotas);
      } else {
        // If user is logged in but hasn't been assigned to a specific school yet in the DB
        // Fetch the first available school as a fallback so testing doesn't halt
        const { data: anySchool } = await supabase
          .from('schools')
          .select(`
            id,
            name,
            district,
            address,
            admission_quotas (*)
          `)
          .limit(1)
          .maybeSingle();

        if (anySchool) {
          setSchool({ ...anySchool, isAssignedDefault: true });
          setQuotas(anySchool.admission_quotas || []);
          initializeEditableSeats(anySchool.admission_quotas || []);
        } else {
          setErrorMessage(
            'Belum ada data sekolah yang terhubung dengan akun Anda. Silakan isi data di tabel `schools` pada Supabase.'
          );
        }
      }
    } catch (err) {
      console.error('Error fetching admin school data:', err);
      setErrorMessage(err.message || 'Gagal memuat data sekolah dari Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const initializeEditableSeats = (quotaList) => {
    const initialMap = {};
    quotaList.forEach((q) => {
      initialMap[q.id] = q.available_seats ?? Math.max(0, (q.total_seats || 0) - (q.filled_seats || 0));
    });
    setEditableSeats(initialMap);
  };

  useEffect(() => {
    if (user) {
      fetchAdminSchool();
    }
  }, [user]);

  // Handle seat input changes
  const handleSeatChange = (quotaId, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setEditableSeats((prev) => ({
      ...prev,
      [quotaId]: num,
    }));
  };

  // Quick increment/decrement buttons
  const handleQuickAdjust = (quotaId, delta, totalSeats) => {
    setEditableSeats((prev) => {
      const current = prev[quotaId] ?? 0;
      const next = Math.max(0, Math.min(totalSeats || 9999, current + delta));
      return { ...prev, [quotaId]: next };
    });
  };

  // Submit update for available_seats to Supabase
  const handleUpdateAvailableSeats = async (quota) => {
    setSavingId(quota.id);
    setSuccessMessage('');
    setErrorMessage('');

    const newAvailableSeats = Number(editableSeats[quota.id] ?? 0);
    const totalSeats = Number(quota.total_seats || 0);

    if (totalSeats > 0 && newAvailableSeats > totalSeats) {
      setErrorMessage(`Sisa kursi (${newAvailableSeats}) tidak boleh melebihi total kuota (${totalSeats}).`);
      setSavingId(null);
      return;
    }

    try {
      const updatedFilledSeats = totalSeats > 0 ? Math.max(0, totalSeats - newAvailableSeats) : quota.filled_seats;
      const now = new Date().toISOString();

      if (isSupabaseConfigured) {
        // Execute Supabase Update query
        const { error: updateError } = await supabase
          .from('admission_quotas')
          .update({
            available_seats: newAvailableSeats,
            filled_seats: updatedFilledSeats,
            updated_at: now,
          })
          .eq('id', quota.id);

        if (updateError) throw updateError;
      }

      // Optimistically update local state
      setQuotas((prev) =>
        prev.map((q) =>
          q.id === quota.id
            ? { ...q, available_seats: newAvailableSeats, filled_seats: updatedFilledSeats, updated_at: now }
            : q
        )
      );

      setSuccessMessage(
        `Berhasil! Kuota ${quota.track_name || 'Jalur'} diperbarui menjadi ${newAvailableSeats} sisa kursi.`
      );

      // Auto-clear success message after 4 seconds
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error updating available seats in Supabase:', err);
      setErrorMessage(err.message || 'Gagal menyimpan perubahan ke database Supabase.');
    } finally {
      setSavingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-base text-gray-800 font-body pb-20">
      
      {/* Admin Top Navigation & Header */}
      <header className="bg-surface border-b border-gray-200/90 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-black text-lg sm:text-xl text-primary">
                  SMAUMU
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                  Panel Sekolah
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                Kelola Kuota & Daya Tampung SMAN Real-Time
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="inline-flex items-center text-xs font-bold text-gray-600 hover:text-primary px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Lihat Portal Publik
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

            <div className="flex items-center space-x-2">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-gray-800">{user?.email}</p>
                <p className="text-[10px] text-gray-500">Petugas Operator SMAN</p>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold text-primary bg-red-50 hover:bg-red-100 border border-red-200/80 transition"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Keluar
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Alerts */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3 text-emerald-800 text-sm font-semibold shadow-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center space-x-3 text-red-800 text-sm font-semibold shadow-sm">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-sm font-semibold text-gray-600 font-heading">
              Menghubungkan ke database Supabase...
            </p>
          </div>
        ) : !school ? (
          <div className="bg-surface rounded-2xl border border-gray-200 p-10 text-center shadow-card max-w-lg mx-auto">
            <School className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-gray-900">
              Sekolah Belum Ditemukan
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Akun Anda belum dipasangkan dengan record sekolah di tabel <code>schools</code> dengan kolom <code>admin_id</code>.
            </p>
            <button
              onClick={fetchAdminSchool}
              className="mt-5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover transition"
            >
              Muat Ulang
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* School Profile Banner (Surface #FFFFFF) */}
            <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-gray-200/90 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-accent">
                    Kecamatan {school.district || 'Umum'}
                  </span>
                  <span className="text-xs text-gray-500">ID: {school.id}</span>
                </div>

                <h1 className="font-heading text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                  {school.name}
                </h1>
                
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {school.address || 'Alamat sekolah resmi'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchAdminSchool}
                  className="inline-flex items-center px-4 py-2.5 rounded-xl border border-gray-300 hover:border-primary text-xs font-bold text-gray-700 hover:text-primary bg-white transition shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Segarkan Data
                </button>
              </div>
            </div>

            {/* Quota Management Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl font-black text-gray-900 flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-primary" />
                    Pembaruan Kuota Tersedia (Available Seats)
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Ubah jumlah <strong>available_seats</strong> di bawah ini. Perubahan akan langsung disinkronkan ke Supabase dan tayang real-time bagi para siswa.
                  </p>
                </div>
              </div>

              {quotas.length === 0 ? (
                <div className="bg-surface p-8 rounded-2xl border border-gray-200 text-center">
                  <p className="text-sm text-gray-500">
                    Belum ada entri jalur kuota di tabel <code>admission_quotas</code> untuk sekolah ini.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {quotas.map((quota) => {
                    const currentAvailable = editableSeats[quota.id] ?? quota.available_seats ?? 0;
                    const isSaving = savingId === quota.id;
                    const totalSeats = Number(quota.total_seats || 0);

                    return (
                      <div
                        key={quota.id}
                        className="bg-surface rounded-2xl border border-gray-200/90 shadow-card p-6 flex flex-col justify-between"
                      >
                        <div>
                          {/* Track Header */}
                          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                                Jalur PPDB
                              </span>
                              <h3 className="font-heading text-lg font-black text-gray-900">
                                {quota.track_name || 'Reguler'}
                              </h3>
                            </div>

                            <div className="text-right">
                              <span className="text-[11px] text-gray-500 block uppercase font-bold">Total Kuota</span>
                              <span className="font-heading text-base font-black text-gray-800">
                                {totalSeats} Kursi
                              </span>
                            </div>
                          </div>

                          {/* Quick Stats info */}
                          <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-base rounded-xl text-center text-xs">
                            <div>
                              <span className="text-gray-500 block text-[11px]">Terakhir Diperbarui</span>
                              <span className="font-bold text-gray-700">
                                {quota.updated_at
                                  ? new Date(quota.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
                                  : '-'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 block text-[11px]">Kalkulasi Terisi</span>
                              <span className="font-bold text-gray-700">
                                {Math.max(0, totalSeats - currentAvailable)} / {totalSeats}
                              </span>
                            </div>
                          </div>

                          {/* Form to update available_seats */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleUpdateAvailableSeats(quota);
                            }}
                            className="space-y-4"
                          >
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                                Sisa Kursi Tersedia (available_seats):
                              </label>

                              <div className="flex items-center space-x-2">
                                {/* Decrement */}
                                <button
                                  type="button"
                                  onClick={() => handleQuickAdjust(quota.id, -1, totalSeats)}
                                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-lg flex items-center justify-center transition"
                                >
                                  -
                                </button>

                                {/* Direct Input */}
                                <input
                                  type="number"
                                  min="0"
                                  max={totalSeats > 0 ? totalSeats : 9999}
                                  value={currentAvailable}
                                  onChange={(e) => handleSeatChange(quota.id, e.target.value)}
                                  className="block w-full py-2.5 px-3 bg-gray-50 border border-gray-300 rounded-xl text-center font-heading text-xl font-black text-primary focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition"
                                />

                                {/* Increment */}
                                <button
                                  type="button"
                                  onClick={() => handleQuickAdjust(quota.id, 1, totalSeats)}
                                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-lg flex items-center justify-center transition"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Quick Step Buttons */}
                            <div className="flex items-center justify-center gap-1.5 text-xs">
                              <span className="text-gray-400 text-[11px] mr-1">Penyesuaian cepat:</span>
                              {[-5, -1, 1, 5].map((delta) => (
                                <button
                                  key={delta}
                                  type="button"
                                  onClick={() => handleQuickAdjust(quota.id, delta, totalSeats)}
                                  className="px-2 py-1 rounded-md bg-gray-100 hover:bg-red-50 hover:text-primary text-[11px] font-bold text-gray-600 transition"
                                >
                                  {delta > 0 ? `+${delta}` : delta}
                                </button>
                              ))}
                            </div>

                            {/* Submit Button in Primary (#CE1126) */}
                            <button
                              type="submit"
                              disabled={isSaving}
                              className="font-heading w-full mt-3 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover active:scale-[0.99] shadow-md shadow-primary/20 hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                              {isSaving ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Menyimpan ke Supabase...
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-2" />
                                  Simpan Sisa Kursi Real-Time
                                </>
                              )}
                            </button>
                          </form>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
