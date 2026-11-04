import '@/styles/globals.css';
import { useEffect } from 'react';
import Head from 'next/head';
import { AuthProvider } from '@/contexts/AuthContext';
import { setupClientApiInterceptor } from '@/utils/fetchInterceptor';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    setupClientApiInterceptor();
  }, []);

  return (
    <AuthProvider>
      <Head>
        <title>SMAUMU - Portal Resmi PPDB SMA Negeri Provinsi DKI Jakarta</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta
          name="description"
          content="Portal Resmi Penerimaan Peserta Didik Baru (PPDB) SMA Negeri Provinsi DKI Jakarta. Transparansi sisa kuota seketika, uji jarak zonasi spasial geodetik, validasi keaslian data kependudukan, dan audit publik kriptografis."
        />
        <meta name="keywords" content="PPDB SMAN Jakarta, PPDB DKI 2026, Dinas Pendidikan DKI Jakarta, Kuota SMA Negeri, Zonasi SMAN Jakarta, SMAUMU, Disdik DKI Jakarta" />
        <meta name="author" content="Dinas Pendidikan Provinsi DKI Jakarta" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="SMAUMU - Portal Resmi PPDB SMA Negeri DKI Jakarta" />
        <meta property="og:description" content="Sistem Informasi Terpadu PPDB SMAN DKI Jakarta: Transparansi Kuota Terbuka, Validasi Domisili, dan Pengawasan Warga." />
        <meta property="og:locale" content="id_ID" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
