import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { MapPin, Phone, Mail, Globe, ArrowLeft, Bell, AlertTriangle } from 'lucide-react';

export const SchoolDetailPage = () => {
  const { id } = useParams();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const data = await dataService.getSchoolById(id);
        setSchool(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchool();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 font-body text-smaumu-primary">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-smaumu-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-semibold text-sm">Memuat profil sekolah...</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center font-body text-smaumu-primary space-y-4">
        <AlertTriangle className="w-12 h-12 mx-auto text-smaumu-accent" />
        <h2 className="font-heading text-2xl font-black">Sekolah Tidak Ditemukan</h2>
        <p className="text-sm">Data sekolah dengan ID tersebut tidak ditemukan di sistem.</p>
        <Link to="/" className="font-heading inline-block px-4 py-2 bg-smaumu-primary text-white rounded-xl text-sm font-bold">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const quota = school.quota || {};
  const total = quota.totalSeats || 0;
  const filled = quota.filledSeats || 0;
  const available = Math.max(0, total - filled);
  const fillPct = total > 0 ? Math.min(100, Math.round((filled / total) * 100)) : 0;
  const statusLabel = available === 0 ? 'Penuh' : fillPct >= 85 ? 'Hampir Penuh' : 'Tersedia';

  const activeAnnouncements = (school.announcements || []).filter((a) => a.isActive);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-gray-900 font-body">

      {/* Breadcrumb */}
      <nav className="flex text-xs text-gray-500 font-semibold space-x-2 font-body">
        <Link to="/" className="hover:text-smaumu-primary transition">Beranda Publik</Link>
        <span>&rsaquo;</span>
        <span className="text-gray-900 font-bold">{school.name}</span>
      </nav>

      {/* School Card Header */}
      <div className="bg-smaumu-surface rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4 font-body">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-body">
          <div>
            <div className="flex items-center space-x-2 mb-2 font-body">
              <span className="font-heading px-2.5 py-0.5 rounded-md text-xs font-black bg-smaumu-primary text-white">
                NPSN: {school.npsn}
              </span>
              <span className="font-body px-2.5 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                Wilayah: {school.district}
              </span>
            </div>
            <h1 className="font-heading text-3xl font-black text-gray-900">{school.name}</h1>
            <p className="font-body text-sm text-gray-600 mt-1 flex items-center space-x-1.5 font-medium">
              <MapPin className="w-4 h-4 text-smaumu-primary flex-shrink-0" />
              <span>{school.address}</span>
            </p>
          </div>

          <div className="text-right font-body">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-black mb-1 font-body ${
                statusLabel === 'Tersedia'
                  ? 'bg-emerald-600 text-white'
                  : statusLabel === 'Hampir Penuh'
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-200 text-gray-700 border border-gray-300'
              }`}
            >
              Status: {statusLabel}
            </span>
            <p className="text-2xl font-black text-smaumu-primary font-body">
              {available}{' '}
              <span className="text-xs font-semibold text-gray-500">/ {total} Kursi Tersedia</span>
            </p>
          </div>
        </div>

        {/* Contact Links */}
        <div className="flex flex-wrap gap-4 pt-3 border-t border-gray-100 text-xs text-gray-600 font-medium font-body">
          {school.phone && (
            <span className="flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-smaumu-primary" />
              <span>{school.phone}</span>
            </span>
          )}
          {school.email && (
            <span className="flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-smaumu-primary" />
              <span>{school.email}</span>
            </span>
          )}
          {school.website && (
            <a
              href={school.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 hover:text-smaumu-primary underline font-semibold"
            >
              <Globe className="w-3.5 h-3.5 text-smaumu-primary" />
              <span>Kunjungi Website Resmi</span>
            </a>
          )}
        </div>
      </div>

      {/* Quota Breakdown Card */}
      <div className="bg-smaumu-surface rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6 font-body">
        <div>
          <h2 className="font-heading text-xl font-black text-gray-900">Rincian Alokasi Jalur PPDB</h2>
          <p className="font-body text-xs text-gray-500 mt-0.5 font-medium">
            Sisa kuota diperbarui langsung oleh panitia sekolah secara transparan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body">
          {/* Zonasi */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 font-body">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-bold text-gray-900">1. Jalur Zonasi</span>
              <span className="text-xs font-black text-smaumu-primary font-body">
                {Math.max(0, (quota.zonasiTotal || 0) - (quota.zonasiFilled || 0))} Kursi Sisa
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-smaumu-primary h-2 rounded-full"
                style={{
                  width: `${quota.zonasiTotal > 0 ? (quota.zonasiFilled / quota.zonasiTotal) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-gray-500 font-semibold font-body">
              <span>Terisi: {quota.zonasiFilled || 0}</span>
              <span>Total Kuota: {quota.zonasiTotal || 0}</span>
            </div>
          </div>

          {/* Prestasi */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 font-body">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-bold text-gray-900">2. Jalur Prestasi</span>
              <span className="text-xs font-black text-smaumu-primary font-body">
                {Math.max(0, (quota.prestasiTotal || 0) - (quota.prestasiFilled || 0))} Kursi Sisa
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-smaumu-primary h-2 rounded-full"
                style={{
                  width: `${quota.prestasiTotal > 0 ? (quota.prestasiFilled / quota.prestasiTotal) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-gray-500 font-semibold font-body">
              <span>Terisi: {quota.prestasiFilled || 0}</span>
              <span>Total Kuota: {quota.prestasiTotal || 0}</span>
            </div>
          </div>

          {/* Afirmasi */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 font-body">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-bold text-gray-900">3. Jalur Afirmasi</span>
              <span className="text-xs font-black text-smaumu-primary font-body">
                {Math.max(0, (quota.afirmasiTotal || 0) - (quota.afirmasiFilled || 0))} Kursi Sisa
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full"
                style={{
                  width: `${quota.afirmasiTotal > 0 ? (quota.afirmasiFilled / quota.afirmasiTotal) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-gray-500 font-semibold font-body">
              <span>Terisi: {quota.afirmasiFilled || 0}</span>
              <span>Total Kuota: {quota.afirmasiTotal || 0}</span>
            </div>
          </div>

          {/* Perpindahan */}
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 font-body">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-bold text-gray-900">4. Jalur Perpindahan Tugas</span>
              <span className="text-xs font-black text-smaumu-primary font-body">
                {Math.max(0, (quota.perpindahanTotal || 0) - (quota.perpindahanFilled || 0))} Kursi Sisa
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-smaumu-primary h-2 rounded-full"
                style={{
                  width: `${quota.perpindahanTotal > 0 ? (quota.perpindahanFilled / quota.perpindahanTotal) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-gray-500 font-semibold font-body">
              <span>Terisi: {quota.perpindahanFilled || 0}</span>
              <span>Total Kuota: {quota.perpindahanTotal || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-smaumu-surface rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4 font-body">
        <h2 className="font-heading text-xl font-black text-gray-900">
          Pengumuman &amp; Siaran Panitia Sekolah
        </h2>

        {activeAnnouncements.length > 0 ? (
          <div className="space-y-3 font-body">
            {activeAnnouncements.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5 font-body">
                <div className="flex items-center justify-between text-xs font-body">
                  <span className="font-heading font-bold text-gray-900 text-sm">{item.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-smaumu-primary text-white font-body">
                    {item.category}
                  </span>
                </div>
                <p className="font-body text-xs text-gray-600 leading-relaxed whitespace-pre-line font-medium">
                  {item.content}
                </p>
                <p className="font-body text-[10px] text-gray-400 pt-1 font-semibold">
                  Diterbitkan pada:{' '}
                  {new Date(item.createdAt).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  WIB
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-body text-xs text-gray-400 py-4 text-center font-medium">
            Belum ada siaran pengumuman aktif dari sekolah ini saat ini.
          </p>
        )}
      </div>

      {/* Back Button */}
      <div>
        <Link
          to="/"
          className="font-heading inline-flex items-center text-xs font-black text-smaumu-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Kembali ke Daftar Semua Sekolah
        </Link>
      </div>

    </div>
  );
};
