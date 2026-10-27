import React, { useState, useEffect, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { 
  Search, 
  MapPin, 
  School, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Filter,
  Sparkles,
  Layers,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Demo fallback data if Supabase tables are not yet seeded
const MOCK_SCHOOLS_FALLBACK = [
  {
    id: 'sch-1',
    name: 'SMAN 1 Jakarta',
    district: 'Jakarta Pusat',
    address: 'Jl. Budi Utomo No. 7, Pasar Baru',
    admission_quotas: [
      { id: 'q-1-1', track_name: 'Zonasi', total_seats: 144, filled_seats: 138, available_seats: 6, updated_at: new Date().toISOString() },
      { id: 'q-1-2', track_name: 'Prestasi', total_seats: 72, filled_seats: 70, available_seats: 2, updated_at: new Date().toISOString() },
      { id: 'q-1-3', track_name: 'Afirmasi', total_seats: 48, filled_seats: 40, available_seats: 8, updated_at: new Date().toISOString() },
      { id: 'q-1-4', track_name: 'Mutasi Orang Tua', total_seats: 16, filled_seats: 16, available_seats: 0, updated_at: new Date().toISOString() }
    ]
  },
  {
    id: 'sch-2',
    name: 'SMAN 8 Jakarta',
    district: 'Jakarta Selatan',
    address: 'Jl. Taman Bukit Duri, Tebet',
    admission_quotas: [
      { id: 'q-2-1', track_name: 'Zonasi', total_seats: 160, filled_seats: 155, available_seats: 5, updated_at: new Date().toISOString() },
      { id: 'q-2-2', track_name: 'Prestasi', total_seats: 80, filled_seats: 80, available_seats: 0, updated_at: new Date().toISOString() },
      { id: 'q-2-3', track_name: 'Afirmasi', total_seats: 50, filled_seats: 42, available_seats: 8, updated_at: new Date().toISOString() },
      { id: 'q-2-4', track_name: 'Mutasi Orang Tua', total_seats: 10, filled_seats: 9, available_seats: 1, updated_at: new Date().toISOString() }
    ]
  },
  {
    id: 'sch-3',
    name: 'SMAN 3 Bandung',
    district: 'Bandung Wetan',
    address: 'Jl. Belitung No. 8, Merdeka',
    admission_quotas: [
      { id: 'q-3-1', track_name: 'Zonasi', total_seats: 150, filled_seats: 130, available_seats: 20, updated_at: new Date().toISOString() },
      { id: 'q-3-2', track_name: 'Prestasi', total_seats: 75, filled_seats: 60, available_seats: 15, updated_at: new Date().toISOString() },
      { id: 'q-3-3', track_name: 'Afirmasi', total_seats: 50, filled_seats: 45, available_seats: 5, updated_at: new Date().toISOString() },
      { id: 'q-3-4', track_name: 'Mutasi Orang Tua', total_seats: 15, filled_seats: 12, available_seats: 3, updated_at: new Date().toISOString() }
    ]
  },
  {
    id: 'sch-4',
    name: 'SMAN 5 Surabaya',
    district: 'Genteng',
    address: 'Jl. Kusuma Bangsa No. 21',
    admission_quotas: [
      { id: 'q-4-1', track_name: 'Zonasi', total_seats: 160, filled_seats: 140, available_seats: 20, updated_at: new Date().toISOString() },
      { id: 'q-4-2', track_name: 'Prestasi', total_seats: 80, filled_seats: 72, available_seats: 8, updated_at: new Date().toISOString() },
      { id: 'q-4-3', track_name: 'Afirmasi', total_seats: 50, filled_seats: 38, available_seats: 12, updated_at: new Date().toISOString() }
    ]
  },
  {
    id: 'sch-5',
    name: 'SMAN 68 Jakarta',
    district: 'Jakarta Pusat',
    address: 'Jl. Salemba Raya No. 18',
    admission_quotas: [
      { id: 'q-5-1', track_name: 'Zonasi', total_seats: 130, filled_seats: 128, available_seats: 2, updated_at: new Date().toISOString() },
      { id: 'q-5-2', track_name: 'Prestasi', total_seats: 60, filled_seats: 60, available_seats: 0, updated_at: new Date().toISOString() },
      { id: 'q-5-3', track_name: 'Afirmasi', total_seats: 40, filled_seats: 39, available_seats: 1, updated_at: new Date().toISOString() }
    ]
  },
  {
    id: 'sch-6',
    name: 'SMAN 70 Jakarta',
    district: 'Jakarta Selatan',
    address: 'Jl. Bulungan Blok C No. 1, Kebayoran Baru',
    admission_quotas: [
      { id: 'q-6-1', track_name: 'Zonasi', total_seats: 140, filled_seats: 115, available_seats: 25, updated_at: new Date().toISOString() },
      { id: 'q-6-2', track_name: 'Prestasi', total_seats: 70, filled_seats: 55, available_seats: 15, updated_at: new Date().toISOString() },
      { id: 'q-6-3', track_name: 'Afirmasi', total_seats: 40, filled_seats: 30, available_seats: 10, updated_at: new Date().toISOString() }
    ]
  }
];

export const PublicDashboard = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  // Fetch schools and admission_quotas from Supabase
  const fetchSchools = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured) {
        // Use demo fallback if environment variables are not yet populated
        setSchools(MOCK_SCHOOLS_FALLBACK);
        setIsUsingFallback(true);
        setLoading(false);
        return;
      }

      // Query schools and join related admission_quotas
      const { data, error: supabaseError } = await supabase
        .from('schools')
        .select(`
          id,
          name,
          district,
          address,
          admission_quotas (
            id,
            track_name,
            total_seats,
            filled_seats,
            available_seats,
            updated_at
          )
        `)
        .order('name', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      if (data && data.length > 0) {
        setSchools(data);
        setIsUsingFallback(false);
      } else {
        // Table exists but is empty -> fallback to preview data so UI remains beautiful
        setSchools(MOCK_SCHOOLS_FALLBACK);
        setIsUsingFallback(true);
      }
    } catch (err) {
      console.warn('Gagal memuat data dari Supabase, beralih ke data fallback lokal:', err.message);
      setError(err.message);
      setSchools(MOCK_SCHOOLS_FALLBACK);
      setIsUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();

    // Setup Supabase Realtime Subscription
    // Any change to admission_quotas triggers an immediate live refresh!
    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('realtime_admission_quotas')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'admission_quotas' },
          (payload) => {
            console.log('Realtime update received from Supabase:', payload);
            fetchSchools();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  // Compute unique districts for filter dropdown
  const districts = useMemo(() => {
    const list = schools.map((s) => s.district).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [schools]);

  // Aggregate quota statistics for each school
  const computeSchoolStats = (school) => {
    const quotas = school.admission_quotas || [];
    let totalSeats = 0;
    let filledSeats = 0;
    let availableSeats = 0;
    let latestUpdate = null;

    quotas.forEach((q) => {
      totalSeats += Number(q.total_seats || 0);
      filledSeats += Number(q.filled_seats || 0);
      availableSeats += Number(q.available_seats || 0);
      if (q.updated_at && (!latestUpdate || new Date(q.updated_at) > new Date(latestUpdate))) {
        latestUpdate = q.updated_at;
      }
    });

    // If available_seats wasn't computed directly, calculate from total - filled
    if (availableSeats === 0 && totalSeats > 0 && totalSeats > filledSeats) {
      availableSeats = Math.max(0, totalSeats - filledSeats);
    }

    const percentage = totalSeats > 0 ? Math.min(100, Math.round((filledSeats / totalSeats) * 100)) : 0;

    return { totalSeats, filledSeats, availableSeats, percentage, latestUpdate };
  };

  // Filtered schools based on search and district
  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (school.district && school.district.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDistrict = selectedDistrict === 'all' || school.district === selectedDistrict;

      return matchesSearch && matchesDistrict;
    });
  }, [schools, searchQuery, selectedDistrict]);

  // National total calculations
  const nationalSummary = useMemo(() => {
    let totalSeats = 0;
    let availableSeats = 0;

    schools.forEach((s) => {
      const stat = computeSchoolStats(s);
      totalSeats += stat.totalSeats;
      availableSeats += stat.availableSeats;
    });

    return { totalSchools: schools.length, totalSeats, availableSeats };
  }, [schools]);

  return (
    <div className="min-h-screen bg-base text-gray-800 font-body pb-16">
      
      {/* Hero Civic-Tech Header with Indonesian Colors (#CE1126 Primary, #FFC000 Accent) */}
      <section className="bg-gradient-to-b from-primary via-[#b90f22] to-primary text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b-4 border-accent shadow-md">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse"></span>
                Sistem Transparansi PPDB SMAN Real-Time
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                SMA UntukMu <span className="text-accent">(SMAUMU)</span>
              </h1>

              <p className="text-sm sm:text-base text-red-50 leading-relaxed font-normal">
                Platform civic-tech bagi siswa kelas 9 & orang tua di Indonesia untuk memantau sisa kuota kursi SMAN secara transparan, langsung dari database resmi sekolah tanpa harus mengantre fisik.
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 flex items-center justify-around md:justify-end gap-6 sm:gap-8 self-start md:self-auto shadow-inner">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider font-semibold text-red-100">Total SMAN</p>
                <p className="font-heading text-2xl sm:text-3xl font-black text-white">{nationalSummary.totalSchools}</p>
              </div>
              <div className="h-10 w-px bg-white/20"></div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider font-semibold text-red-100">Sisa Kuota Kursi</p>
                <p className="font-heading text-2xl sm:text-3xl font-black text-accent">{nationalSummary.availableSeats}</p>
              </div>
            </div>
          </div>

          {/* Banner notification when Supabase credentials or tables are in demo/preview mode */}
          {isUsingFallback && (
            <div className="mt-6 p-3.5 rounded-xl bg-accent/20 border border-accent/40 text-xs text-white flex items-center justify-between backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
                <span>
                  <strong>Mode Demonstrasi:</strong> Menampilkan data kuota simulasi. Hubungkan <code>.env</code> dengan URL & Anon Key Supabase Anda untuk data produksi langsung.
                </span>
              </div>
              <button
                onClick={fetchSchools}
                className="hidden sm:inline-flex items-center px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-bold text-white transition ml-3"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Cek Ulang
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        
        {/* Controls Bar: Search & District Filter on Surface (#FFFFFF) */}
        <div className="bg-surface rounded-2xl shadow-card border border-gray-200/80 p-4 sm:p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama SMAN atau kecamatan..."
                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Simple District Filter */}
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-600 flex-shrink-0">
                <Filter className="w-4 h-4 mr-1 text-primary" />
                Wilayah:
              </div>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full md:w-60 py-2.5 px-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-800 focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white transition cursor-pointer"
              >
                <option value="all">Semua Wilayah ({districts.length} Wilayah)</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <button
                onClick={fetchSchools}
                title="Perbarui Data"
                className="p-2.5 rounded-xl border border-gray-300 hover:border-primary text-gray-600 hover:text-primary hover:bg-red-50 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : ''}`} />
              </button>
            </div>

          </div>
        </div>

        {/* Content State: Loading, Empty, or Cards Grid */}
        {loading && schools.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-sm font-semibold text-gray-600 font-heading">
              Memuat data kuota SMAN dari Supabase...
            </p>
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-gray-200 p-12 text-center shadow-card max-w-xl mx-auto">
            <School className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-gray-900">
              Tidak Ada SMAN Ditemukan
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Coba sesuaikan kata kunci pencarian atau ubah pilihan filter wilayah.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDistrict('all'); }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-primary bg-red-50 hover:bg-red-100 transition"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          /* Grid of Schools and their Admission Quotas */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => {
              const { totalSeats, filledSeats, availableSeats, percentage, latestUpdate } = computeSchoolStats(school);
              const quotas = school.admission_quotas || [];

              // Status badge logic
              const isFull = availableSeats <= 0;
              const isWarning = availableSeats > 0 && availableSeats <= 10;

              return (
                <div
                  key={school.id}
                  className="bg-surface rounded-2xl border border-gray-200/90 shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all duration-200 flex flex-col overflow-hidden group"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-100 bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-heading text-lg font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                          {school.name}
                        </h2>
                        <div className="flex items-center text-xs text-gray-500 mt-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-primary flex-shrink-0" />
                          <span className="truncate">{school.district || 'Wilayah Belum Ditentukan'}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {isFull ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-red-100 text-primary border border-red-200 flex-shrink-0">
                          Penuh
                        </span>
                      ) : isWarning ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-accent flex-shrink-0">
                          <AlertTriangle className="w-3 h-3 mr-1 text-accent-dark" />
                          Sisa {availableSeats}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200 flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          Tersedia
                        </span>
                      )}
                    </div>

                    {school.address && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-1 italic">
                        {school.address}
                      </p>
                    )}
                  </div>

                  {/* Quota Highlights Box */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    
                    {/* Primary Numbers Metric */}
                    <div className="grid grid-cols-3 gap-2 bg-base p-3.5 rounded-xl border border-gray-200/60 text-center">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider font-bold text-gray-500">Total Kuota</p>
                        <p className="font-heading text-lg font-black text-gray-900">{totalSeats}</p>
                      </div>
                      <div className="border-x border-gray-200">
                        <p className="text-[11px] uppercase tracking-wider font-bold text-gray-500">Terisi</p>
                        <p className="font-heading text-lg font-black text-gray-700">{filledSeats}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider font-bold text-primary">Sisa Kursi</p>
                        <p className={`font-heading text-lg font-black ${isFull ? 'text-gray-400' : isWarning ? 'text-amber-600' : 'text-primary'}`}>
                          {availableSeats}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-gray-600">
                        <span>Keterisian Kursi</span>
                        <span className="font-bold text-gray-900">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percentage >= 100 
                              ? 'bg-primary' 
                              : percentage >= 85 
                              ? 'bg-accent' 
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Detailed Admission Quotas Breakdown per Track */}
                    {quotas.length > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-[11px] uppercase tracking-wider font-bold text-gray-500 mb-2 flex items-center">
                          <Layers className="w-3.5 h-3.5 mr-1 text-primary" />
                          Rincian Jalur Penerimaan:
                        </p>
                        <div className="space-y-1.5">
                          {quotas.map((q) => (
                            <div
                              key={q.id}
                              className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 transition"
                            >
                              <span className="font-medium text-gray-700">{q.track_name || 'Reguler'}</span>
                              <div className="flex items-center space-x-2 font-mono">
                                <span className="text-gray-500">
                                  {q.filled_seats || 0}/{q.total_seats || 0}
                                </span>
                                <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                                  q.available_seats === 0
                                    ? 'bg-red-50 text-primary font-bold'
                                    : 'bg-emerald-50 text-emerald-700'
                                }`}>
                                  Sisa: {q.available_seats ?? Math.max(0, (q.total_seats || 0) - (q.filled_seats || 0))}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Card Footer: Timestamp & Real-Time Indicator */}
                  <div className="px-5 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      {latestUpdate
                        ? `Update: ${new Date(latestUpdate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
                        : 'Update Real-Time'}
                    </span>
                    <span className="inline-flex items-center text-primary font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1 animate-pulse"></span>
                      Tersinkronisasi
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};

export default PublicDashboard;
